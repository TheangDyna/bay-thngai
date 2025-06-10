import { Minus, Plus } from "lucide-react";
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
}

export const CardProduct: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  originalPrice,
  unit,
  cartQty = 0,
  onAddToCart,
  onClickProductModalDetails
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
    <div
      onClick={handleOpenModal}
      className="relative cursor-pointer bg-white shadow-sm rounded-lg p-4 w-full max-w-[300px] h-[350px] group hover:shadow-md transition-shadow duration-300"
    >
      {originalPrice && (
        <span className="absolute top-4 left-4 bg-green-300 text-white text-xs font-semibold uppercase px-2 py-1 rounded-full">
          On Sale
        </span>
      )}

      <div className="relative flex justify-center items-center overflow-hidden rounded-md h-[200px] bg-gray-100">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />

        {isInCart ? (
          <div className="absolute bottom-4 flex justify-center items-center">
            <div className="bg-white shadow px-4 py-2 rounded-full flex items-center space-x-10">
              <button
                onClick={handleDecrement}
                aria-label="Decrease quantity"
                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="font-medium">{cartQty}</span>
              <button
                onClick={handleIncrement}
                aria-label="Increase quantity"
                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full"
              >
                <Plus className="w-4 h-4 text-gray-600" />
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

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-black">{price}</span>
          {originalPrice && (
            <del className="text-sm text-gray-500">{originalPrice}</del>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-800 mt-2 truncate">
          {title}
        </h3>
      </div>

      <div className="absolute bottom-4 left-4 text-sm text-gray-500">
        {unit}
      </div>
    </div>
  );
};
