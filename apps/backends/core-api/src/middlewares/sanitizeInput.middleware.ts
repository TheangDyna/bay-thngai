import { Request, Response, NextFunction } from "express";

export const sanitizeProductInput = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.body.price) {
    req.body.price = Number(req.body.price);
  }
  if (req.body.inStock) {
    req.body.inStock = req.body.inStock === "true";
  }
  next();
};
