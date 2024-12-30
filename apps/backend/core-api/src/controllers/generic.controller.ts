import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Document } from "mongoose";
import { GenericService } from "../services/generic.service";

export class GenericController<T extends Document> {
  private service: GenericService<T>;

  constructor(service: GenericService<T>) {
    this.service = service;
  }

  public createOne = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const document = await this.service.createOne(req.body);
      res.status(201).json({
        status: "success",
        data: document
      });
    }
  );

  public getAll = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const documents = await this.service.getAll(req.query);
      res.status(200).json({
        status: "success",
        results: documents.length,
        data: documents
      });
    }
  );

  public getOne = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const document = await this.service.getOne(req.params.id);
      res.status(200).json({
        status: "success",
        data: document
      });
    }
  );

  public updateOne = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const document = await this.service.updateOne(req.params.id, req.body);
      res.status(200).json({
        status: "success",
        data: document
      });
    }
  );

  public deleteOne = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.service.deleteOne(req.params.id);
      res.status(204).json({
        status: "success",
        data: null
      });
    }
  );
}
