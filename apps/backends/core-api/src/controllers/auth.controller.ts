import { UserService } from "@/src/services/user.service";
import { IAddress } from "@/src/types/user.types";
import { Request, Response } from "express";
import { config } from "../configs/config";
import { AuthService } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import { clearAllCookies, setAuthCookies } from "../utils/cookie";

export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }
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

  public login = catchAsync(async (req: Request, res: Response) => {
    const cognitoToken = await this.authService.login(req.body);

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
    const { target } = req.query;

    if (target === "admin") {
      res.redirect(config.adminUrl);
    } else {
      res.redirect(config.clientUrl);
    }
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

  public getMe = catchAsync(async (req: Request, res: Response) => {
    res.status(200).json({
      status: "success",
      data: req.user
    });
  });

  public getAllAddresses = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const addresses = await this.userService.getAllAddresses(req.user.id);
      res.status(201).json({
        status: "success",
        data: addresses
      });
    }
  );
  public addAddress = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const addressData: IAddress = req.body;
      const newAddress = await this.userService.addAddress(
        req.user.id,
        addressData
      );
      res.status(201).json({
        status: "success",
        data: newAddress
      });
    }
  );

  public updateAddress = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const addressData: Partial<IAddress> = req.body;
      const updatedAddress = await this.userService.updateAddress(
        req.user.id,
        req.params.addressId,
        addressData
      );
      res.status(200).json({
        status: "success",
        data: updatedAddress
      });
    }
  );

  public deleteAddress = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.userService.deleteAddress(req.user.id, req.params.addressId);
      res.status(204).json({ status: "success", data: null });
    }
  );
}
