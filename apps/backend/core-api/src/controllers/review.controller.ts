import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ReviewService } from "../services/review.service";
import { GenericController } from "./generic.controller";
import { IReviewDocument } from "../types/review.types";

export class ReviewController extends GenericController<IReviewDocument> {
  private reviewService: ReviewService;

  constructor() {
    const reviewService = new ReviewService();
    super(reviewService);
    this.reviewService = reviewService;
  }

  public createOne = catchAsync(
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

  public getAll = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      req.query.product = req.body.product;
      const documents = await this.reviewService.getAll(req.query);
      res.status(200).json({
        status: "success",
        results: documents.length,
        data: documents
      });
    }
  );

  public updateOne = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { user: userId, product: productId, ...data } = req.body;
      const document = await this.reviewService.updateReview(
        req.params.id,
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

  public deleteOne = catchAsync(
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
