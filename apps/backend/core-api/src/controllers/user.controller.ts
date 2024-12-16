import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { UserService } from "../services/user.service";

export class UserController {
  public static getAllUsers = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const users = await UserService.getAllUsers(req.query);
      res.status(200).json({
        status: "success",
        results: users.length,
        data: users
      });
    }
  );

  public static getUser = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = await UserService.getUserById(req.params.id);
      res.status(200).json({
        status: "success",
        data: user
      });
    }
  );
}
