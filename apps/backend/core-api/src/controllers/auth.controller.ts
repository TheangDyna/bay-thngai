import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import {
  ConfirmSignUpInput,
  ForgotPasswordInput,
  ResendConfirmCodeUpInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput
} from "../types/auth.types";
import setCookie from "../utils/cookie";

export class AuthController {
  public static signUp = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const signUpData: SignUpInput = req.body;
      await AuthService.signUp(signUpData);

      res.status(201).json({
        status: "success",
        message: "User signed up successfully. Please confirm your email."
      });
    }
  );

  public static resendConfirmCode = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const resendComfirmCodeData: ResendConfirmCodeUpInput = req.body;
      await AuthService.resendConfirmCode(resendComfirmCodeData);
      res.status(200).json({
        status: "success",
        message: "Resend code successfully. Please confirm your email."
      });
    }
  );

  public static confirmSignUp = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const comfirmSignUpData: ConfirmSignUpInput = req.body;
      await AuthService.confirmSignUp(comfirmSignUpData);
      res.status(200).json({
        status: "success",
        message: "User confirmed successfully."
      });
    }
  );

  public static signIn = catchAsync(async (req: Request, res: Response) => {
    const signInData: SignInInput = req.body;
    const cognitoToken = await AuthService.signIn(signInData);

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

  public static me = catchAsync(async (_req: Request, res: Response) => {
    res.status(200).json({
      status: "success"
    });
  }); // not yet

  public static forgotPassword = catchAsync(
    async (req: Request, res: Response) => {
      const forgotPasswordData: ForgotPasswordInput = req.body;
      await AuthService.forgotPassword(forgotPasswordData);

      res.status(200).json({
        status: "success"
      });
    }
  ); // not yet

  public static updateMyPassword = catchAsync(
    async (req: Request, res: Response) => {
      const resetPasswordData: ResetPasswordInput = req.body;
      await AuthService.resetPassword(resetPasswordData);

      res.status(200).json({
        status: "success"
      });
    }
  ); // not yet

  public static updateMe = catchAsync(async (req: Request, res: Response) => {
    const resetPasswordData: ResetPasswordInput = req.body;
    await AuthService.resetPassword(resetPasswordData);

    res.status(200).json({
      status: "success"
    });
  }); // not yet

  public static deleteMe = catchAsync(async (req: Request, res: Response) => {
    const resetPasswordData: ResetPasswordInput = req.body;
    await AuthService.resetPassword(resetPasswordData);

    res.status(204).json({
      status: "success",
      data: null
    });
  }); // not yet
}
