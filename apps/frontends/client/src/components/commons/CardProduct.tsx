import { Card } from "@/components/ui/card";
import { Discount } from "@/types/discount.types";
import { calculateDiscountedPrice } from "@/utils/price";
import { Minus, Plus, Star } from "lucide-react";
import React, { useCallback } from "react";

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  originalPrice?: string;
  cartQty?: number;
  onAddToCart: (qty: number) => void;
  onViewDetails: () => void;
  onClickProductModalDetails: () => void;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  sold: number;
  discount: Discount;
  inStock: boolean;
}

export const CardProduct: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  cartQty = 0,
  onAddToCart,
  onClickProductModalDetails,
  ratingsAverage,
  ratingsQuantity,
  sold,
  discount,
  inStock
}) => {
  const isInCart = cartQty > 0;

  const handleAdd = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAddToCart(1);
    },
    [onAddToCart]
  );

  const handleIncrement = handleAdd;

  const handleDecrement = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAddToCart(-1);
    },
    [onAddToCart]
  );

  const handleOpenModal = useCallback(
    () => onClickProductModalDetails(),
    [onClickProductModalDetails]
  );

  const { isDiscountActive, finalPrice } = calculateDiscountedPrice(
    price,
    discount
  );

  return (
    <Card
      onClick={handleOpenModal}
      className="cursor-pointer rounded-lg w-full max-w-[300px] h-[320px] transition-shadow duration-300 mx-auto"
    >
      <div className="relative flex justify-center items-center overflow-hidden rounded-md group h-[200px] bg-muted">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {inStock ? (
            <span className="text-white bg-primary text-xs font-semibold px-2 py-1 rounded-full">
              On Sale
            </span>
          ) : (
            <span className="text-white bg-red-500 text-xs font-semibold px-2 py-1 rounded-full">
              Sold Out
            </span>
          )}

          {isDiscountActive && (
            <span className="w-fit bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {discount.amount}
              {discount.type === "percentage" ? "% OFF" : "$ OFF"}
            </span>
          )}
        </div>

        {/* Cart controls */}
        {isInCart ? (
          <div className="absolute bottom-4 flex justify-center items-center">
            <div className="bg-white shadow px-4 py-2 rounded-full flex items-center space-x-10">
              <button
                onClick={handleDecrement}
                className="w-6 h-6 flex items-center justify-center hover:bg-muted rounded-full"
              >
                <Minus className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="font-medium">{cartQty}</span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 flex items-center justify-center hover:bg-muted rounded-full"
              >
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="absolute bottom-4 right-4 bg-green-500 text-white p-2 rounded-full shadow hover:bg-green-600 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">
            ${finalPrice.toFixed(2)}
          </span>
          {isDiscountActive && (
            <del className="text-sm text-muted-foreground">
              ${price.toFixed(2)}
            </del>
          )}
        </div>
        <h3 className="text-sm font-medium truncate">{title}</h3>
        <div className="flex justify-between items-center">
          {ratingsAverage && (
            <div className="flex items-center gap-1">
              <div className="flex items-center text-yellow-500">
                <Star size={16} fill="currentColor" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-muted-foreground">
                {ratingsAverage}
              </span>
              <span className="text-sm text-muted-foreground">
                ({ratingsQuantity})
              </span>
            </div>
          )}
          {sold > 0 && (
            <div className="flex-1 text-right text-sm text-muted-foreground">
              {sold} Sold
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
