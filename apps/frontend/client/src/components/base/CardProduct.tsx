import React from "react";
import { Eye, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  unit: string;
  isOnSale?: boolean;
  onAddToCart: () => void;
  onViewDetails: () => void;
}

const CardGrocery: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  originalPrice,
  unit,
  isOnSale = false,
  onAddToCart,
  onViewDetails
}) => {
  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 w-full max-w-[300px] group hover:shadow-lg transition-shadow duration-300">
      {/* Sale Badge */}
      {isOnSale && (
        <div className="absolute top-6 left-6 bg-green-500 text-white text-xs font-bold rounded-full px-3 py-1 z-10">
          ON SALE
        </div>
      )}

      {/* Product Image */}
      <div className="relative flex justify-center items-center overflow-hidden rounded-md h-[200px] bg-gray-100 group">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        {/* Eye Icon */}
        <button
          onClick={onViewDetails}
          className="absolute bottom-4 right-4 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition duration-300"
          aria-label="View Details"
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>

      {/* Product Details */}
      <div className="mt-4">
        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-black">{price}</span>
          {originalPrice && (
            <del className="text-sm text-gray-500">${originalPrice}</del>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-800 mt-2 truncate">
          {title}
        </h3>
      </div>

      {/* Unit */}
      <div className="absolute bottom-4 left-4 text-sm text-gray-500">
        {unit}
      </div>

      {/* Add to Cart Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onAddToCart}
          className="flex items-center gap-2 justify-center w-10 h-10 rounded-full bg-green-500 text-white hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          aria-label="Add to Cart"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CardGrocery;
