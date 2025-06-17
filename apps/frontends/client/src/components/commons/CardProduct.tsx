import { Card } from "@/components/ui/card";
import { Minus, Plus, Star } from "lucide-react";
import React, { useCallback } from "react";

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  unit: string;
  cartQty?: number;
  onAddToCart: (qty: number) => void;
  onViewDetails: () => void;
  onClickProductModalDetails: () => void;
  ratingsAverage?: number;
  ratingsQuantity?: number;
}

export const CardProduct: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  unit,
  cartQty = 0,
  onAddToCart,
  onClickProductModalDetails,
  ratingsAverage,
  ratingsQuantity
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

  return (
    <Card
      onClick={handleOpenModal}
      className="cursor-pointer rounded-lg w-full max-w-[300px] h-[320px]  transition-shadow duration-300 mx-auto"
    >
      <div className="relative flex justify-center items-center overflow-hidden rounded-md group h-[200px] bg-muted">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
        />
        <span className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold uppercase px-2 py-1 rounded-full">
          On Sale
        </span>
        {isInCart ? (
          <div className="absolute bottom-4 flex justify-center items-center">
            <div className="bg-white shadow px-4 py-2 rounded-full flex items-center space-x-10">
              <button
                onClick={handleDecrement}
                aria-label="Decrease quantity"
                className="w-6 h-6 flex items-center justify-center hover:bg-muted rounded-full"
              >
                <Minus className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="font-medium">{cartQty}</span>
              <button
                onClick={handleIncrement}
                aria-label="Increase quantity"
                className="w-6 h-6 flex items-center justify-center hover:bg-muted rounded-full"
              >
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={handleAdd}
              aria-label="Add to cart"
              className="absolute bottom-4 right-4 bg-green-500 text-white p-2 rounded-full shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">{price}</span>
          <del className="text-sm text-muted-foreground">$100.00</del>
        </div>
        <h3 className="text-sm font-medium truncate">{title}</h3>
        <div className="flex justify-between items-center">
          {ratingsAverage && (
            <div className="flex items-center gap-2">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={
                      i < Math.round(ratingsAverage) ? "currentColor" : "none"
                    }
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({ratingsQuantity})
              </span>
            </div>
          )}

          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
      </div>
    </Card>
  );
};
