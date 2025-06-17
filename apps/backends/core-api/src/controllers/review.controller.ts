import { Request, Response } from "express";
import { ReviewService } from "../services/review.service";
import { catchAsync } from "../utils/catchAsync";

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  public createReview = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user.id;
      const productId = req.params.productId;
      const { ...data } = req.body;
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

  public getReviewsByProduct = catchAsync(
    async (req: Request, res: Response) => {
      const reviews = await this.reviewService.getReviewsByProduct(
        req.params.productId
      );
      res.status(200).json({
        status: "success",
        data: reviews
      });
    }
  );

  public getRatingSummary = catchAsync(async (req: Request, res: Response) => {
    const summary = await this.reviewService.getRatingSummary(
      req.params.productId
    );
    res.status(200).json({ status: "success", data: summary });
  });

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
