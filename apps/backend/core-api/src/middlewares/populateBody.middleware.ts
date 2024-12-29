import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";

export const setProductAndUserIds = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (req.params.productId && req.user && req.user.id) {
    req.body.product = req.params.productId;
    req.body.user = req.user.id;
  }
  next();
};
