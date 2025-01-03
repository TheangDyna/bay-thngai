import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import { setAuthCookies, clearAllCookies } from "../utils/cookie";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { config } from "../configs/config";

export class AuthController {
  private authService = new AuthService();

  public register = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.authService.register(req.body);

      res.status(201).json({
        status: "success",
        message:
          "Registration successful! Please check your email to confirm your account."
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

  public confirmRegister = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.authService.confirmRegister(req.body);

      res.status(200).json({
        status: "success",
        message: "Your account has been successfully confirmed!"
      });
    }
  );

  public logIn = catchAsync(async (req: Request, res: Response) => {
    const cognitoToken = await this.authService.logIn(req.body);

    setAuthCookies(res, cognitoToken);

    res.status(200).json({
      status: "success",
      message: "You have successfully logged in!"
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

    // redirect specific target
    // const { target } = req.query;

    // if (target === "admin") {
    //   res.redirect("https://your-app.com/admin-dashboard");
    // } else if (target === "user") {
    //   res.redirect("https://your-app.com/user-dashboard");
    // } else {
    //   res.redirect("https://your-app.com");
    // }
    res.redirect(config.adminUrl);
  });

  public logOut = catchAsync(async (req: Request, res: Response) => {
    const tokens = req.cookies;
    const accessToken = tokens["access_token"];

    await this.authService.logOut(accessToken);

    clearAllCookies(res, req.cookies);

    res.status(200).json({
      status: "success",
      message: "You have successfully logged out!"
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
