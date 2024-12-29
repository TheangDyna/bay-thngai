import { Product } from "../models/product.model";
import { GenericRepository } from "../repositories/generic.repository";
import { IProductDocument } from "../types/product.types";

export class ProductService extends GenericRepository<IProductDocument> {
  constructor() {
    super(Product);
  }
}
