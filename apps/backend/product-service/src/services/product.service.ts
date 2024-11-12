import {
  ProductCreateRequest,
  ProductGetAllRequest,
  ProductUpdateRequest
} from "@/src/controllers/types/product-request.type";
import { IProduct } from "@/src/database/models/product.model";
import ProductRepository from "../database/repositories/product.repository";
import OpenAI from "openai";

export class ProductService {
  public async userPrompt(prompt: string): Promise<any> {
    try {
      const api = new OpenAI({
        baseURL: "https://api.zukijourney.com/v1",
        apiKey: "zu-ce055b0b00ce5ccdaf4f640be43b0ae7"
      });

      const completion = await api.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
              You are an AI assistant that converts user prompts into valid Mongoose query instructions.
              Instructions must include:
              - operation: Mongoose method (e.g., find, findOne, etc.).
              - query: The filter object.
              - options: Any additional options like sort, limit, select, skip, etc.
              The schema for reference is:
              - name: String
              - price: Number
              - category: String
              Return only the instructions in JSON format.`
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      const queryText = completion.choices[0].message.content;

      // console.log("queryText:", queryText);

      if (!queryText) {
        throw new Error("Failed to generate a query from the prompt.");
      }

      // Remove the Markdown format (triple backticks and the json specifier)
      const cleanString = queryText.replace(/```json\n|\n```/g, "");

      // Parse it as JSON if needed
      const aiGeneratedInstructions = JSON.parse(cleanString);

      if (
        typeof aiGeneratedInstructions !== "object" ||
        !aiGeneratedInstructions.operation
      ) {
        throw new Error("Invalid AI-generated instructions");
      }

      const result = await ProductRepository.dynamicQuery(
        aiGeneratedInstructions
      );

      return result;
    } catch (error) {
      console.error(`ProductService - userPrompt() method error: ${error}`);
      throw error;
    }
  }

  public async getAllProducts(queries: ProductGetAllRequest) {
    try {
      const { page, limit, filter, sort } = queries;

      const newQueries = {
        page,
        limit,
        filter: filter && JSON.parse(filter),
        sort: sort && JSON.parse(sort)
      };
      const result = await ProductRepository.getAll(newQueries);

      return result;
    } catch (error) {
      console.error(`ProductService - getAllProducts() method error: ${error}`);
      throw error;
    }
  }

  public async createProduct(
    productRequest: ProductCreateRequest
  ): Promise<IProduct> {
    try {
      const newProduct = await ProductRepository.createProduct(productRequest);
      return newProduct;
    } catch (error) {
      console.error(`ProductService - createProduct() method error: ${error}`);
      throw error;
    }
  }

  public async getProductById(productId: string): Promise<IProduct> {
    try {
      const product = await ProductRepository.getProductById(productId);
      return product;
    } catch (error) {
      console.error(`ProductService - getProductById() method error: ${error}`);
      throw error;
    }
  }

  public async updateProductById(
    productId: string,
    productRequest: ProductUpdateRequest
  ): Promise<IProduct> {
    try {
      const updatedProduct = await ProductRepository.updateProductById(
        productId,
        productRequest
      );
      return updatedProduct;
    } catch (error) {
      console.error(
        `ProductService - updateProductById() method error: ${error}`
      );
      throw error;
    }
  }

  public async deleteProductById(id: string): Promise<void> {
    try {
      await ProductRepository.deleteProductById(id);
    } catch (error) {
      console.error(
        `ProductService - deleteProductById() method error: ${error}`
      );
      throw error;
    }
  }
}

export default new ProductService();
