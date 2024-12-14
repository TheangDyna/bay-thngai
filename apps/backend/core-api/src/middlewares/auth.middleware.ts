import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { config } from "../configs/config";
import { UserService } from "../services/user.service";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { IUserDocument } from "../types/user.types";
import { AuthService } from "../services/auth.service";
import setCookie from "../utils/cookie";

export interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: config.awsCognitoUserPoolId,
  tokenUse: "access",
  clientId: config.awsCognitoClientId
});

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    const username = req.cookies.username;

    // 1. Check if both tokens are missing
    if (!accessToken && !refreshToken) {
      throw new AppError(
        "You are not logged in. Please log in to access this route.",
        401
      );
    }

    let payload;

    // 2. Handle refresh token if access token is missing
    if (!accessToken && refreshToken && username) {
      try {
        const cognitoToken = await AuthService.refreshAccessToken(
          username,
          refreshToken
        );

        // Set new tokens in cookies
        setCookie(res, "id_token", cognitoToken.idToken);
        setCookie(res, "access_token", cognitoToken.accessToken);
        setCookie(res, "refresh_token", cognitoToken.refreshToken, {
          maxAge: 30 * 24 * 3600 * 1000 // 30 days
        });
        setCookie(res, "username", cognitoToken.username, {
          maxAge: 30 * 24 * 3600 * 1000 // 30 days
        });

        // Verify the refreshed access token
        payload = await verifier.verify(cognitoToken.accessToken);
      } catch (error) {
        throw new AppError(
          "Failed to refresh tokens. Please log in again.",
          401
        );
      }
    } else {
      // 3. Verify the access token
      try {
        payload = await verifier.verify(accessToken);
      } catch (error) {
        throw new AppError(
          "Invalid or expired token. Please log in again.",
          401
        );
      }
    }

    // 4. Validate payload and fetch the user from the database
    if (!payload || !payload.username) {
      throw new AppError("Invalid or expired token. Please log in again", 401);
    }

    try {
      const user = await UserService.getUserByCognitoId(payload.username);
      req.user = user;
    } catch (error) {
      throw new AppError(
        "User associated with this token no longer exists.",
        401
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo =
  (...roles: string[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(
        "You do not have permission to perform this action.",
        403
      );
    }
    next();
  };
