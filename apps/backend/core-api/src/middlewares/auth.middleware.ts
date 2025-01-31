import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { config } from "../configs/config";
import { UserService } from "../services/user.service";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { IUserDocument, UserRole } from "../types/user.types";
import { AuthService } from "../services/auth.service";
import { setAuthCookies } from "../utils/cookie";

export interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: config.awsCognitoUserPoolId,
  tokenUse: "access",
  clientId: config.awsCognitoClientId
});

// note when logout access_token still valid

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    const username = req.cookies.username;

    if (!accessToken && !refreshToken) {
      throw new AppError(
        "You are not logged in. Please log in to access this page.",
        401
      );
    }

    let payload;

    if (!accessToken && username && refreshToken) {
      try {
        const authService = new AuthService();
        const cognitoToken = await authService.refreshAccessToken(
          username,
          refreshToken
        );

        setAuthCookies(res, cognitoToken);

        payload = await verifier.verify(cognitoToken.accessToken);
      } catch (error) {
        throw new AppError(
          "Your session has expired or is invalid. Please log in again.",
          401
        );
      }
    } else {
      try {
        payload = await verifier.verify(accessToken);
      } catch (error) {
        throw new AppError(
          "Your session has expired or is invalid. Please log in again.",
          401
        );
      }
    }

    if (!payload || !payload.username) {
      throw new AppError("Your session is invalid. Please log in again.", 401);
    }

    try {
      const userService = new UserService();
      const user = await userService.getBy({ cognitoId: payload.sub });
      req.user = user;
    } catch (error) {
      throw new AppError(
        "The user associated with this session no longer exists. Please contact support if this is unexpected.",
        401
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo =
  (...roles: UserRole[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(
        "You do not have the necessary permissions to perform this action.",
        403
      );
    }
    next();
  };
