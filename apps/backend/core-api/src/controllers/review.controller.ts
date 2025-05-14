import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ReviewService } from "../services/review.service";

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  public createReview = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { user: userId, product: productId, ...data } = req.body;
      const document = await this.reviewService.createReview(
        data,
        userId,
        productId
      );
      res.status(201).json({
        status: "success",
        data: document
      });
    }
  );

  public updateReview = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { user: userId, product: productId, ...data } = req.body;
      const document = await this.reviewService.updateReview(
        req.params.id,
        data,
        userId,
        productId
      );
      res.status(200).json({
        status: "success",
        data: document
      });
    }
  );

  public deleteReview = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.body.user;
      const productId = req.body.product;
      await this.reviewService.deleteReview(req.params.id, userId, productId);

      res.status(204).json({
        status: "success",
        data: null
      });
    }
  );
}
