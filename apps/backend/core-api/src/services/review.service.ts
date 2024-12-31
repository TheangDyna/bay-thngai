import { Types } from "mongoose";
import { Review } from "../models/review.model";
import { GenericRepository } from "../repositories/generic.repository";
import { IReviewDocument } from "../types/review.types";
import { AppError } from "../utils/appError";
import { GenericService } from "./generic.service";
import { ProductService } from "./product.service";

export class ReviewService extends GenericService<IReviewDocument> {
  private productService: ProductService;
  private reviewRepository: GenericRepository<IReviewDocument>;

  constructor() {
    const reviewRepository = new GenericRepository(Review);
    super(reviewRepository);
    this.productService = new ProductService();
    this.reviewRepository = new GenericRepository(Review);
  }

  public async createReview(
    data: Partial<IReviewDocument>,
    userId: string,
    productId: string
  ): Promise<IReviewDocument> {
    const reviewQuery = { user: userId, product: productId };
    await this.productService.getOne(productId);
    const existingReview = await this.reviewRepository
      .getBy(reviewQuery)
      .catch((error) => {
        if (error instanceof AppError && error.statusCode === 404) return null;
        throw error;
      });

    if (existingReview) {
      throw new AppError("You have already reviewed this product.", 400);
    }

    const review = await this.reviewRepository.createOne({
      ...reviewQuery,
      ...data
    });
    await this.updateAverageRatings(productId);
    return review;
  }

  public async updateReview(
    id: string,
    data: Partial<IReviewDocument>,
    userId: string,
    productId: string
  ): Promise<IReviewDocument> {
    const reviewQuery = { _id: id, user: userId, product: productId };
    const existingReview = await this.reviewRepository
      .getBy(reviewQuery)
      .catch((error) => {
        if (error instanceof AppError && error.statusCode === 404) {
          throw new AppError("You do not own this review.", 403);
        }
        throw error;
      });

    if (!existingReview) {
      throw new AppError("Review not found.", 404);
    }

    const updatedReview = await this.reviewRepository.updateOne(id, data);
    await this.updateAverageRatings(productId);
    return updatedReview;
  }

  public async deleteReview(
    id: string,
    userId: string,
    productId: string
  ): Promise<void> {
    const reviewQuery = { _id: id, user: userId, product: productId };
    const existingReview = await this.reviewRepository
      .getBy(reviewQuery)
      .catch((error) => {
        if (error instanceof AppError && error.statusCode === 404) {
          throw new AppError("You do not own this review.", 403);
        }
        throw error;
      });

    if (!existingReview) {
      throw new AppError("Review not found.", 404);
    }

    await this.reviewRepository.deleteOne(id);
    await this.updateAverageRatings(productId);
  }

  private async updateAverageRatings(productId: string): Promise<void> {
    const stats = await Review.aggregate([
      { $match: { product: new Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          numRatings: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await this.productService.updateOne(productId, {
        ratingsAverage: stats[0].avgRating.toFixed(1),
        ratingsQuantity: stats[0].numRatings
      });
    } else {
      await this.productService.updateOne(productId, {
        ratingsAverage: 0,
        ratingsQuantity: 0
      });
    }
  }
}
