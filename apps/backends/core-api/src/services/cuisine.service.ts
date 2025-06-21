import { CuisineRepository } from "@/repositories/cuisine.repository";
import { ICuisineDocument } from "@/types/cuisine.types";

export class CuisineService {
  private repository: CuisineRepository;

  constructor() {
    this.repository = new CuisineRepository();
  }

  public async createCuisine(
    data: Partial<ICuisineDocument>
  ): Promise<ICuisineDocument> {
    return await this.repository.createCuisine(data);
  }

  public async getAllCuisines(
    queryString: Record<string, any>
  ): Promise<{ total: number; cuisines: ICuisineDocument[] }> {
    return await this.repository.getAllCuisines(queryString);
  }

  public async getCuisineById(id: string): Promise<ICuisineDocument> {
    return await this.repository.getCuisineById(id);
  }

  public async getCuisineByField(
    fieldObj: Record<string, any>
  ): Promise<ICuisineDocument> {
    return await this.repository.getCuisineByField(fieldObj);
  }

  public async updateCuisine(
    id: string,
    data: Partial<ICuisineDocument>
  ): Promise<ICuisineDocument> {
    return await this.repository.updateCuisine(id, data);
  }

  public async deleteCuisine(id: string): Promise<void> {
    await this.repository.deleteCuisine(id);
  }
}
