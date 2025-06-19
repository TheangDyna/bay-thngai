import { Discount } from "@/types/discount.types";

export const calculateDiscountedPrice = (
  price: number,
  discount?: Discount
) => {
  const numericPrice = price;
  const now = new Date();

  const isDiscountActive =
    discount &&
    discount.active &&
    new Date(discount.startDate) <= now &&
    new Date(discount.endDate) >= now;

  const finalPrice = isDiscountActive
    ? discount.type === "percentage"
      ? numericPrice * (1 - discount.amount / 100)
      : numericPrice - discount.amount
    : numericPrice;

  return { isDiscountActive, finalPrice };
};
