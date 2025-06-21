import { UserService } from "@/src/services/user.service";
import { IAddress, IContact, IUserDocument } from "@/src/types/user.types";
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

  public googleLogin = catchAsync(async (req: Request, res: Response) => {
    const { target } = req.query;
    const targetStr =
      typeof target === "string"
        ? target
        : Array.isArray(target) && typeof target[0] === "string"
          ? target[0]
          : "client";
    const cognitoOAuthURL = await this.authService.googleLogin(targetStr);

    res.status(200).json({
      status: "success",
      data: cognitoOAuthURL
    });
  });

  public googleCallback = catchAsync(async (req: Request, res: Response) => {
    const cognitoToken = await this.authService.googleCallback(req.query);

    setAuthCookies(res, cognitoToken);

    const { state } = req.query;

    if (state === "admin") {
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
      res.status(200).json({
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

  public getAllContacts = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const contacts = await this.userService.getAllContacts(req.user.id);
      res.status(200).json({
        status: "success",
        data: contacts
      });
    }
  );

  public addContact = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { label, value } = req.body as IContact;
      if (!label || !value) {
        throw new Error("Both label and value are required");
      }
      const newContact = await this.userService.addContact(req.user.id, {
        label,
        value
      });
      res.status(201).json({
        status: "success",
        data: newContact
      });
    }
  );

  public updateContact = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const contactId = req.params.contactId;
      const updates = req.body as Partial<IContact>;
      const updatedContact = await this.userService.updateContact(
        req.user.id,
        contactId,
        updates
      );
      res.status(200).json({
        status: "success",
        data: updatedContact
      });
    }
  );

  public deleteContact = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.userService.deleteContact(req.user.id, req.params.contactId);
      res.status(204).json({ status: "success", data: null });
    }
  );

  public updateInfo = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      // only these keys are allowed in the profile
      const allowed = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "height",
        "weight",
        "activityLevel",
        "dietaryPreferences",
        "healthGoals",
        "allergies",
        "dailyCalorieTarget"
      ] as const;

      // pick only provided, allowed fields
      const updates: Partial<IUserDocument> = {};
      for (const key of allowed) {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      }

      // uses existing updateUser → UserRepository.findByIdAndUpdate(…, data) :contentReference[oaicite:0]{index=0}
      const updated = await this.userService.updateUser(req.user.id, updates);
      res.status(200).json({ status: "success", data: updated });
    }
  );

  // WISHLIST
  public getWishlist = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const wishlist = await this.userService.getWishlist(req.user.id);
      res.status(200).json({
        status: "success",
        data: wishlist
      });
    }
  );

  public addToWishlist = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { productId } = req.body;
      const addedProductId = await this.userService.addToWishlist(
        req.user.id,
        productId
      );
      res.status(201).json({
        status: "success",
        data: addedProductId
      });
    }
  );

  public removeFromWishlist = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.userService.removeFromWishlist(
        req.user.id,
        req.params.productId
      );
      res.status(204).json({ status: "success", data: null });
    }
  );
}
