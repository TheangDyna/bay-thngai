// src/components/commons/CardProductCart.tsx
import { Badge } from "@/components/ui/badge";
import type { CartItem } from "@/contexts/cart.context";
import { calculateDiscountedPrice } from "@/utils/price";
import { MinusIcon, Plus, X } from "lucide-react";
import React from "react";

interface CardProductCartProps {
  item: CartItem;
  onRemove: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

const CardProductCart: React.FC<CardProductCartProps> = ({
  item,
  onRemove,
  onIncrement,
  onDecrement
}) => {
  const { price: basePrice, discount, quantity, image, name } = item;
  const { isDiscountActive, finalPrice } = calculateDiscountedPrice(
    basePrice,
    discount
  );
  const lineTotal = finalPrice * quantity;

  return (
    <div className="group w-full h-20 relative flex items-center gap-2 border-b last:border-none">
      <div className="w-16 h-16 bg-muted rounded-sm overflow-hidden relative">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        <div className="absolute top-0 right-0 group-hover:opacity-30 bg-black opacity-0 w-full h-full transition" />
      </div>

      <button
        onClick={onRemove}
        className="absolute top-1/3 left-5 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="flex-1 flex justify-between items-start p-2">
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={onDecrement}
              disabled={quantity <= 1}
              className="w-6 h-6 border rounded-full flex items-center justify-center disabled:opacity-50"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="w-6 text-center">{quantity}</span>
            <button
              onClick={onIncrement}
              className="w-6 h-6 border rounded-full flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-baseline space-x-2">
            {!isDiscountActive && (
              <span className="text-sm font-semibold">
                ${finalPrice.toFixed(2)}
              </span>
            )}

            {isDiscountActive && (
              <del className="text-sm font-semibold text-muted-foreground">
                ${basePrice.toFixed(2)}
              </del>
            )}
          </div>
          {discount && isDiscountActive && (
            <Badge
              variant="outline"
              className={`text-xs ${
                discount.type === "percentage"
                  ? "border-orange-500 text-orange-500"
                  : "border-green-500 text-green-500"
              }`}
            >
              {discount.type === "percentage"
                ? `${discount.amount}% off`
                : `$${discount.amount} off`}
            </Badge>
          )}
          <span className="font-semibold mt-1">${lineTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CardProductCart;
