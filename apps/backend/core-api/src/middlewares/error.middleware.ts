import { Request, Response, NextFunction } from "express";
import { MongoServerError } from "mongodb";
import { Error as MongooseError } from "mongoose";
import { CognitoIdentityProviderServiceException } from "@aws-sdk/client-cognito-identity-provider";
import { config } from "../configs/config";
import logger from "../utils/logger";
import { AppError } from "../utils/appError";
import { z } from "zod";
import { formatZodErrors } from "../utils/formatZodErrors";

const COGNITO_ERROR_MAP: Record<
  string,
  { message: string; statusCode: number }
> = {
  UserNotFoundException: { message: "User not found.", statusCode: 404 },
  UsernameExistsException: {
    message: "Email already registered.",
    statusCode: 409
  },
  InvalidPasswordException: {
    message: "Password does not meet requirements.",
    statusCode: 400
  },
  CodeMismatchException: {
    message: "Invalid verification code.",
    statusCode: 400
  },
  ExpiredCodeException: {
    message: "Verification code has expired.",
    statusCode: 400
  },
  NotAuthorizedException: {
    message: "Incorrect username or password.",
    statusCode: 401
  }
};

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

    logger.error(errorMessage);

    return new AppError(`${errorMessage}`, 400);
  }

  private handleCognitoError(
    error: CognitoIdentityProviderServiceException
  ): AppError {
    const { name } = error;
    const defaultError = {
      message: "Authentication service error.",
      statusCode: 500
    };
    const mappedError = COGNITO_ERROR_MAP[name] || defaultError;

    return new AppError(mappedError.message, mappedError.statusCode);
  }

  private handleMongoError(error: MongoServerError): AppError {
    switch (error.code) {
      case 11000:
        const field = error ? Object.keys(error.keyValue)[0] : "unknown";
        const value = error.keyValue ? error.keyValue[field] : "unknown";

        return new AppError(
          `Duplicate value "${value}" for field "${field}". Please use a unique value.`,
          409
        );
      default:
        return new AppError("Database error.", 500);
    }
  }

  private handleMongooseError(error: MongooseError): AppError {
    if (error instanceof MongooseError.ValidationError) {
      const errorMessages = Object.values(error.errors)
        .map((err) => `${err.path}: ${err.message}`)
        .join(", ");

      return new AppError(`Validation failed: ${errorMessages}.`, 400);
    }

    if (error instanceof MongooseError.CastError) {
      return new AppError(`Invalid ${error.path}: ${error.value}.`, 400);
    }

    return new AppError("Database error.", 500);
  }

  public handleError(error: Error | AppError | any): AppError {
    // Already handled errors
    if (error instanceof AppError) {
      return error;
    }

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return this.handleZodError(error);
    }

    // Cognito errors
    if (error instanceof CognitoIdentityProviderServiceException) {
      return this.handleCognitoError(error);
    }

    // MongoDB errors
    if (error instanceof MongoServerError) {
      return this.handleMongoError(error);
    }

    // Mongoose errors
    if (error instanceof MongooseError) {
      return this.handleMongooseError(error);
    }

    // Unhandled errors
    return new AppError("Internal server error.", 500);
  }
}

export const errorHandler = (
  err: Error | AppError | any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const handler = ErrorHandler.getInstance();
  const error = handler.handleError(err);

  if (config.nodeEnv === "development") {
    logger.error({
      message: error.message,
      code: error.code,
      stack: error.stack,
      originalError: err
    });
  } else {
    logger.error({
      message: error.message,
      code: error.code,
      path: req.path
    });
  }

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    ...(config.nodeEnv === "development" && { stack: error.stack })
  });
};
