import { Product } from "../models/product.model";
import { GenericRepository } from "../repositories/generic.repository";
import { IProductDocument } from "../types/product.types";
import { GenericService } from "./generic.service";

export class ProductService extends GenericService<IProductDocument> {
  constructor() {
    const reviewRepository = new GenericRepository(Product);
    super(reviewRepository);
  }
}
