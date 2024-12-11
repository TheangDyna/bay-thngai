import { Request, Response, NextFunction } from "express";
import { ZodSchema, z } from "zod";

export const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          status: "fail",
          errors: err.errors
        });
      } else {
        next(err);
      }
    }
  };
};
