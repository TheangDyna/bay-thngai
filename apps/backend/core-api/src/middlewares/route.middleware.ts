import { Request, Response } from "express";
import { AppError } from "../utils/appError";

export const routeNotFound = (req: Request, _res: Response) => {
  throw new AppError(`Route ${req.originalUrl} not found`, 404);
};
