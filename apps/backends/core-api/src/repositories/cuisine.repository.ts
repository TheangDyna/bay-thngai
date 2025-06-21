import { Cuisine } from "@/models/cuisine.model";
import { ICuisineDocument } from "@/types/cuisine.types";
import { APIFeatures } from "@/utils/apiFeatures";
import { AppError } from "@/utils/appError";

export class CuisineRepository {
  private searchFields: string[];

  constructor() {
    this.searchFields = [];
  }

  public async createCuisine(
    data: Partial<ICuisineDocument>
  ): Promise<ICuisineDocument> {
    const cuisine = await Cuisine.create(data);
    return cuisine;
  }

  public async getAllCuisines(
    queryString: Record<string, any>
  ): Promise<{ cuisines: ICuisineDocument[]; total: number }> {
    const features = new APIFeatures<ICuisineDocument>(
      Cuisine.find(),
      queryString
    )
      .filter()
      .search(this.searchFields);

    const total = await Cuisine.countDocuments(features.getQuery().getFilter());

    features.sort().select();

    const cuisines = await features.getQuery();
    return { total, cuisines };
  }

  public async getCuisineById(id: string): Promise<ICuisineDocument> {
    const cuisine = await Cuisine.findById(id);
    if (!cuisine) {
      throw new AppError("Cuisine not found.", 404);
    }
    return cuisine;
  }

  public async getCuisineByField(
    fieldObj: Record<string, any>
  ): Promise<ICuisineDocument> {
    const cuisine = await Cuisine.findOne(fieldObj);
    if (!cuisine) {
      throw new AppError("Cuisine not found.", 404);
    }
    return cuisine;
  }

  public async updateCuisine(
    id: string,
    data: Partial<ICuisineDocument>
  ): Promise<ICuisineDocument> {
    const cuisine = await Cuisine.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    if (!cuisine) {
      throw new AppError("Cuisine not found.", 404);
    }
    return cuisine;
  }

  public async deleteCuisine(id: string): Promise<void> {
    const cuisine = await Cuisine.findByIdAndDelete(id);
    if (!cuisine) {
      throw new AppError("Cuisine not found.", 404);
    }
  }
}
