import { Request, Response } from "express";
import { AppError } from "../utils/appError";

export const routeNotFound = (req: Request, _res: Response) => {
  throw new AppError(
    `The requested route '${req.originalUrl}' was not found on this server.`,
    404
  );
};
