import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import { clearCookie, setCookie } from "../utils/cookie";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class AuthController {
  private authService = new AuthService();

  public signUp = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.authService.signUp(req.body);

      res.status(201).json({
        status: "success",
        message: "User signed up successfully. Please confirm your email."
      });
    }
  );

  public resendConfirmCode = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.authService.resendConfirmCode(req.body);
      res.status(200).json({
        status: "success",
        message: "Resend code successfully. Please confirm your email."
      });
    }
  );

  public confirmSignUp = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.authService.confirmSignUp(req.body);
      res.status(200).json({
        status: "success",
        message: "User confirmed successfully."
      });
    }
  );

  public signIn = catchAsync(async (req: Request, res: Response) => {
    const cognitoToken = await this.authService.signIn(req.body);

    setCookie(res, "id_token", cognitoToken.idToken);
    setCookie(res, "access_token", cognitoToken.accessToken);
    setCookie(res, "refresh_token", cognitoToken.refreshToken, {
      maxAge: 30 * 24 * 3600 * 1000 // 30 days
    });
    setCookie(res, "username", cognitoToken.username, {
      maxAge: 30 * 24 * 3600 * 1000 // 30 days
    });

    res.status(200).json({
      status: "success",
      message: "User signed in successfully."
    });
  });

  public googleLogin = catchAsync(async (_req: Request, res: Response) => {
    const cognitoOAuthURL = await this.authService.googleLogin();
    res.status(200).json({
      status: "success",
      data: cognitoOAuthURL
    });
  });

  public googleCallback = catchAsync(async (req: Request, res: Response) => {
    const cognitoToken = await this.authService.googleCallback(req.query);

    setCookie(res, "id_token", cognitoToken.idToken);
    setCookie(res, "access_token", cognitoToken.accessToken);
    setCookie(res, "refresh_token", cognitoToken.refreshToken, {
      maxAge: 30 * 24 * 3600 * 1000 // 30 days
    });
    setCookie(res, "username", cognitoToken.username, {
      maxAge: 30 * 24 * 3600 * 1000 // 30 days
    });

    res.status(200).json({
      status: "success",
      message: "User signed in successfully."
    });
  });

  public signOut = catchAsync(async (req: Request, res: Response) => {
    const tokens = req.cookies;
    const accessToken = tokens["access_token"];

    await this.authService.signOut(accessToken);

    for (const token in tokens) {
      clearCookie(res, token);
    }

    res.status(200).json({
      status: "success",
      message: "User signed out successfully."
    });
  });

  public getMe = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      res.status(200).json({
        status: "success",
        data: req.user
      });
    }
  );

  public forgotPassword = catchAsync(async (req: Request, res: Response) => {
    await this.authService.forgotPassword(req.body);

    res.status(200).json({
      status: "success"
    });
  }); // not yet

  public updateMyPassword = catchAsync(async (req: Request, res: Response) => {
    await this.authService.resetPassword(req.body);

    res.status(200).json({
      status: "success"
    });
  }); // not yet

  public updateMe = catchAsync(async (req: Request, res: Response) => {
    await this.authService.resetPassword(req.body);

    res.status(200).json({
      status: "success"
    });
  }); // not yet

  public deleteMe = catchAsync(async (req: Request, res: Response) => {
    await this.authService.resetPassword(req.body);

    res.status(204).json({
      status: "success",
      data: null
    });
  }); // not yet
}
