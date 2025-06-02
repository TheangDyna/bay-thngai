import { CuisineService } from "@/src/services/cuisine.service";
import { catchAsync } from "@/src/utils/catchAsync";
import { Request, Response } from "express";

export class CuisineController {
  private service: CuisineService;

  constructor() {
    this.service = new CuisineService();
  }

  public createCuisine = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const cuisine = await this.service.createCuisine(req.body);
      res.status(201).json({
        status: "success",
        data: cuisine
      });
    }
  );

  public getAllCuisines = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { total, cuisines } = await this.service.getAllCuisines(req.query);
      res.status(200).json({
        status: "success",
        total,
        results: cuisines.length,
        data: cuisines
      });
    }
  );

  public getCuisineById = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const cuisine = await this.service.getCuisineById(req.params.cuisineId);
      res.status(200).json({
        status: "success",
        data: cuisine
      });
    }
  );

  public updateCuisine = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const cuisine = await this.service.updateCuisine(
        req.params.cuisineId,
        req.body
      );
      res.status(200).json({
        status: "success",
        data: cuisine
      });
    }
  );

  public deleteCuisine = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.service.deleteCuisine(req.params.cuisineId);
      res.status(204);
    }
  );
}
