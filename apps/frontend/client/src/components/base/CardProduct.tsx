import React from "react";
import { Eye, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  unit: string;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
  onClickProductModalDetails?: () => void;
  className?: string;
}

const CardProduct: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  originalPrice,
  unit,
  onAddToCart,
  onViewDetails,
  onClickProductModalDetails,
  className
}) => {
  return (
    <div
      onClick={onClickProductModalDetails}
      className={`relative cursor-pointer bg-white shadow-sm rounded-lg p-4 w-full max-w-[300px] h-[350px] shrink-0 group hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      {/* Product Image */}
      <div className="relative flex justify-center items-center overflow-hidden rounded-md h-[200px] bg-gray-100 group">
        <img
          src={image}
          alt={title}
          className="object-cover w-[200px] transition-transform duration-300 group-hover:scale-105"
        />
        {/* Eye Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onClick
            onViewDetails();
          }}
          className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300"
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
      <div className="mb-4 flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onClick
            onAddToCart();
          }}
          className="flex items-center gap-2 justify-center w-10 h-10 rounded-full bg-green-500 text-white hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          aria-label="Add to Cart"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CardProduct;
