import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import { setAuthCookies, clearAllCookies } from "../utils/cookie";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class AuthController {
  private authService = new AuthService();

  public signUp = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.authService.signUp(req.body);

      res.status(201).json({
        status: "success",
        message:
          "You have signed up successfully! Please check your email to confirm your account."
      });
    }
  );

  public resendConfirmCode = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.authService.resendConfirmCode(req.body);

      res.status(200).json({
        status: "success",
        message:
          "A new confirmation code has been sent! Please check your email."
      });
    }
  );

  public confirmSignUp = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.authService.confirmSignUp(req.body);

      res.status(200).json({
        status: "success",
        message: "Your account has been successfully confirmed!"
      });
    }
  );

  public signIn = catchAsync(async (req: Request, res: Response) => {
    const cognitoToken = await this.authService.signIn(req.body);

    setAuthCookies(res, cognitoToken);

    res.status(200).json({
      status: "success",
      message: "You have successfully signed in!"
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

    setAuthCookies(res, cognitoToken);

    res.status(200).json({
      status: "success",
      message: "You have successfully signed in via Google!"
    });
  });

  public signOut = catchAsync(async (req: Request, res: Response) => {
    const tokens = req.cookies;
    const accessToken = tokens["access_token"];

    await this.authService.signOut(accessToken);

    clearAllCookies(res, req.cookies);

    res.status(200).json({
      status: "success",
      message: "You have successfully signed out!"
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
