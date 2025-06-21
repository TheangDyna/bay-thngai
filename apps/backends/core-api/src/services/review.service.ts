import { ReviewRepository } from "@/repositories/review.repository";
import { Types } from "mongoose";
import { Review } from "../models/review.model";
import { IReviewDocument } from "../types/review.types";
import { AppError } from "../utils/appError";
import { ProductService } from "./product.service";

export class ReviewService {
  private productService: ProductService;
  private reviewRepository: ReviewRepository;

  constructor() {
    this.productService = new ProductService();
    this.reviewRepository = new ReviewRepository();
  }

  public async createReview(
    data: Partial<IReviewDocument>,
    userId: string,
    productId: string
  ): Promise<IReviewDocument> {
    const reviewQuery = { user: userId, product: productId };
    await this.productService.getProductById(productId);
    const existingReview = await this.reviewRepository
      .getReviewByField(reviewQuery)
      .catch((error) => {
        if (error instanceof AppError && error.statusCode === 404) return null;
        throw error;
      });

    if (existingReview) {
      throw new AppError("You have already reviewed this product.", 400);
    }

    const review = await this.reviewRepository.createReview({
      ...reviewQuery,
      ...data
    });
    await this.updateAverageRatings(productId);
    return review;
  }

  public async getReviewsByProduct(
    productId: string
  ): Promise<IReviewDocument[]> {
    await this.productService.getProductById(productId);
    const { reviews } = await this.reviewRepository.getAllReviews({
      product: productId
    });

    return reviews;
  }

  public async updateReview(
    id: string,
    data: Partial<IReviewDocument>,
    userId: string,
    productId: string
  ): Promise<IReviewDocument> {
    const reviewQuery = { _id: id, user: userId, product: productId };
    const existingReview = await this.reviewRepository
      .getReviewByField(reviewQuery)
      .catch((error) => {
        if (error instanceof AppError && error.statusCode === 404) {
          throw new AppError("You do not own this review.", 403);
        }
        throw error;
      });

    if (!existingReview) {
      throw new AppError("Review not found.", 404);
    }

    const updatedReview = await this.reviewRepository.updateReview(id, data);
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
      .getAllReviews(reviewQuery)
      .catch((error) => {
        if (error instanceof AppError && error.statusCode === 404) {
          throw new AppError("You do not own this review.", 403);
        }
        throw error;
      });

    if (!existingReview) {
      throw new AppError("Review not found.", 404);
    }

    await this.reviewRepository.deleteReview(id);
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
      await this.productService.updateProduct(productId, {
        ratingsAverage: stats[0].avgRating.toFixed(1),
        ratingsQuantity: stats[0].numRatings
      });
    } else {
      await this.productService.updateProduct(productId, {
        ratingsAverage: 0,
        ratingsQuantity: 0
      });
    }
  }

  public async getRatingSummary(productId: string) {
    const breakdown = await Review.aggregate([
      { $match: { product: new Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    const total = breakdown.reduce((sum, r) => sum + r.count, 0);

    return {
      total,
      breakdown: [5, 4, 3, 2, 1].map((star) => {
        const found = breakdown.find((r) => r._id === star);
        const count = found ? found.count : 0;
        return {
          rating: star,
          count,
          percent: total ? (count / total) * 100 : 0
        };
      })
    };
  }
}
