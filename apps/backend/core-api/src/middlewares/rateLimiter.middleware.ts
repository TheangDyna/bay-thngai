import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP. Please try again later.",
  handler: (_req: Request, _res: Response, next: NextFunction, options) => {
    const error = new AppError(options.message, 429);
    next(error);
  }
});
