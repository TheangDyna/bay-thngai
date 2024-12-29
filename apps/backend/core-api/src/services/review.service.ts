import { Review } from "../models/review.model";
import { GenericRepository } from "../repositories/generic.repository";
import { IReviewDocument } from "../types/review.types";
import { AppError } from "../utils/appError";
import { GenericService } from "./generic.service";
import { ProductService } from "./product.service";

export class ReviewService extends GenericService<IReviewDocument> {
  private productService: ProductService;

  constructor() {
    const reviewRepository = new GenericRepository(Review);
    super(reviewRepository);
    this.productService = new ProductService();
  }

  public async createOne(
    data: Partial<IReviewDocument>
  ): Promise<IReviewDocument> {
    await this.productService.getOne(data.product);

    try {
      const existingReview = await this.getBy({
        product: data.product,
        user: data.user
      });
      if (existingReview) {
        throw new AppError("You have already reviewed this product.", 400);
      }
    } catch (error) {
      if (!(error instanceof AppError && error.statusCode === 404)) {
        throw error;
      }
    }
    return super.createOne(data);
  }

  // Get all reviews for a specific product
  // public async getAllByProduct(productId: string): Promise<IReviewDocument[]> {
  //   return Review.find({ product: productId });
  // }

  // Update a specific review
  // public async updateOne(
  //   reviewId: string,
  //   data: Partial<IReviewDocument>
  // ): Promise<IReviewDocument> {
  //   const review = await this.updateOne(reviewId, data);

  //   if (!review) {
  //     throw new AppError("Review not found.", 404);
  //   }

  //   return review;
  // }

  // Delete a specific review
  // public async deleteOne(reviewId: string): Promise<void> {
  //   const review = await this.model.findByIdAndDelete(reviewId);

  //   if (!review) {
  //     throw new AppError("Review not found.", 404);
  //   }
  // }
}
