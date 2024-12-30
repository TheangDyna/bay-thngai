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
    await this.productService.getOne(productId);
    try {
      const existingReview = await this.getBy({
        user: userId,
        product: productId
      });
      if (existingReview) {
        throw new AppError("You have already reviewed this product.", 400);
      }
    } catch (error) {
      if (!(error instanceof AppError && error.statusCode === 404)) {
        throw error;
      }
    }
    return this.reviewRepository.createOne(data);
  }

  public async updateReview(
    id: string,
    data: Partial<IReviewDocument>,
    userId: string,
    productId: string
  ): Promise<IReviewDocument> {
    try {
      const existingReview = await this.getBy({
        user: userId,
        product: productId
      });
      if (!existingReview) {
        throw new AppError("You do not own this review.", 400);
      }
    } catch (error) {
      throw error;
    }
    return this.reviewRepository.updateOne(id, data);
  }

  public async deleteReview(
    id: string,
    userId: string,
    productId: string
  ): Promise<void> {
    try {
      const existingReview = await this.getBy({
        user: userId,
        product: productId
      });
      if (!existingReview) {
        throw new AppError("You do not own this review.", 400);
      }
    } catch (error) {
      throw error;
    }
    return this.reviewRepository.deleteOne(id);
  }
}
