import { Request, Response, NextFunction } from "express";
import { MongoServerError } from "mongodb";
import { Error as MongooseError } from "mongoose";
import { CognitoIdentityProviderServiceException } from "@aws-sdk/client-cognito-identity-provider";
import { config } from "../configs/config";
import logger from "../utils/logger";
import { AppError } from "../utils/appError";
import { z } from "zod";
import { formatZodErrors } from "../utils/formatZodErrors";
import { cognitoErrorMap } from "@/src/utils/cognitoErrorMap";

class ErrorHandler {
  private static instance: ErrorHandler;

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private handleZodError(error: z.ZodError): AppError {
    const errorMessage = formatZodErrors(error.errors);
    return new AppError(`Validation error: ${errorMessage}`, 400);
  }

  private handleCognitoError(
    error: CognitoIdentityProviderServiceException
  ): AppError {
    const defaultError = {
      message: "An error occurred during authentication.",
      statusCode: 500
    };
    const mappedError = cognitoErrorMap[error.name] || defaultError;
    if (
      error.name === "NotAuthorizedException" &&
      mappedError.specificMessages
    ) {
      const specificMessage =
        mappedError.specificMessages[error.message] || mappedError.message;
      return new AppError(specificMessage, mappedError.statusCode);
    }

    return new AppError(mappedError.message, mappedError.statusCode);
  }

  private handleMongoError(error: MongoServerError): AppError {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0] || "unknown";
      const value = error.keyValue?.[field] || "unknown";
      return new AppError(
        `Duplicate value "${value}" for field "${field}".`,
        409
      );
    }
    return new AppError(
      "An error occurred while interacting with the database.",
      500
    );
  }

  private handleMongooseError(error: MongooseError): AppError {
    if (error instanceof MongooseError.ValidationError) {
      const errorMessages = Object.values(error.errors)
        .map((err) => `${err.path}: ${err.message}`)
        .join(", ");
      return new AppError(`Validation error: ${errorMessages}.`, 400);
    }

    if (error instanceof MongooseError.CastError) {
      return new AppError(
        `Invalid value for ${error.path}: ${error.value}.`,
        400
      );
    }

    return new AppError(
      "An error occurred while interacting with the database.",
      500
    );
  }

  public handleError(error: Error | AppError | any): AppError {
    if (error instanceof AppError) return error;
    if (error instanceof z.ZodError) return this.handleZodError(error);
    if (error instanceof CognitoIdentityProviderServiceException)
      return this.handleCognitoError(error);
    if (error instanceof MongoServerError) return this.handleMongoError(error);
    if (error instanceof MongooseError) return this.handleMongooseError(error);
    return new AppError("An unexpected error occurred.", 500);
  }
}

export const errorHandler = (
  err: Error | AppError | any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const handler = ErrorHandler.getInstance();
  const error = handler.handleError(err);

  console.log("Original Error: ", err);

  const logData = {
    message: error.message,
    code: error.code,
    ...(config.nodeEnv === "development" && {
      stack: error.stack,
      originalError: err
    })
  };

  if (error.statusCode === 500) {
    logger.error(logData);
  }

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    ...(config.nodeEnv === "development" && { stack: error.stack })
  });
};
