import { DiscountService } from "@/src/services/discount.service";
import { catchAsync } from "@/src/utils/catchAsync";
import { Request, Response } from "express";

export class DiscountController {
  private service: DiscountService;

  constructor() {
    this.service = new DiscountService();
  }

  public create = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const discount = await this.service.createDiscount(req.body);
      res.status(201).json(discount);
    }
  );

  public getAll = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { total, discounts } = await this.service.getAllDiscounts(
        req.query
      );
      res.status(200).json({
        status: "success",
        total,
        results: discounts.length,
        data: discounts
      });
    }
  );

  public getOne = catchAsync(async (req: Request, res: Response) => {
    const discount = await this.service.getDiscountById(req.params.discountId);
    res.json({ data: discount });
  });

  public update = catchAsync(async (req: Request, res: Response) => {
    const updated = await this.service.updateDiscountById(
      req.params.discountId,
      req.body
    );
    res.json(updated);
  });

  public assignToProducts = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { discountId, productIds } = req.body;
      await this.service.assignToProducts(discountId, productIds);
      res.json({ message: "Discount assigned successfully" });
    }
  );

  public removeFromProducts = catchAsync(
    async (req: Request, res: Response) => {
      const { productIds } = req.body;
      await this.service.removeDiscountFromProducts(productIds);
      res.json({ message: "Discount removed from products" });
    }
  );
}
