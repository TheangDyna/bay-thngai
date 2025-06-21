// src/controllers/user.controller.ts
import { UserService } from "@/services/user.service";
import { catchAsync } from "@/utils/catchAsync";
import { Request, Response } from "express";

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  public createUser = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = await this.service.createUser(req.body);
      res.status(201).json({
        status: "success",
        data: user
      });
    }
  );

  public getAllUsers = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { total, users } = await this.service.getAllUsers(req.query);
      res.status(200).json({
        status: "success",
        total,
        results: users.length,
        data: users
      });
    }
  );

  public getUserById = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = await this.service.getUserById(req.params.userId);
      res.status(200).json({
        status: "success",
        data: user
      });
    }
  );

  public updateUser = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = await this.service.updateUser(req.params.userId, req.body);
      res.status(200).json({
        status: "success",
        data: user
      });
    }
  );

  public deleteUser = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.service.deleteUser(req.params.id);
      res.status(204).json({ status: "success", data: null });
    }
  );
}
