import { Review } from "@/models/review.model";
import { IReviewDocument } from "@/types/review.types";
import { APIFeatures } from "@/utils/apiFeatures";
import { AppError } from "@/utils/appError";

export class ReviewRepository {
  private searchFields: string[];

  constructor() {
    this.searchFields = [];
  }

  public async createReview(
    data: Partial<IReviewDocument>
  ): Promise<IReviewDocument> {
    const review = await Review.create(data);
    return review;
  }

  public async getAllReviews(
    queryString: Record<string, any>
  ): Promise<{ reviews: IReviewDocument[]; total: number }> {
    const features = new APIFeatures<IReviewDocument>(
      Review.find(),
      queryString
    )
      .filter()
      .search(this.searchFields);

    const total = await Review.countDocuments(features.getQuery().getFilter());

    features.sort().select().paginate();

    const reviews = await features.getQuery();
    return { total, reviews };
  }

  public async getReviewById(id: string): Promise<IReviewDocument> {
    const review = await Review.findById(id);
    if (!review) {
      throw new AppError("Review not found.", 404);
    }
    return review;
  }

  public async getReviewByField(
    fieldObj: Record<string, any>
  ): Promise<IReviewDocument> {
    const review = await Review.findOne(fieldObj);
    if (!review) {
      throw new AppError("Review not found.", 404);
    }
    return review;
  }

  public async updateReview(
    id: string,
    data: Partial<IReviewDocument>
  ): Promise<IReviewDocument> {
    const review = await Review.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    if (!review) {
      throw new AppError("Review not found.", 404);
    }
    return review;
  }

  public async deleteReview(id: string): Promise<void> {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      throw new AppError("Review not found.", 404);
    }
  }
}
