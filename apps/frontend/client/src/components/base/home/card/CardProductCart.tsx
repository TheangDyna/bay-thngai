import React from "react";
import { MinusIcon, Plus, X } from "lucide-react";

interface CardProductCartProps {
  imageUrl: string;
  title: string;
  price: number;
  quantity: number;
  onRemove: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  isRemoving?: boolean;
  isUpdatingQuantity?: boolean;
}

const CardProductCart: React.FC<CardProductCartProps> = ({
  imageUrl,
  title,
  price,
  quantity,
  onRemove,
  onIncrement,
  onDecrement,
  isRemoving = false,
  isUpdatingQuantity = false
}) => {
  return (
    <div className="w-full px-5 md:px-7">
      <div className="group w-full flex items-center gap-4 py-4 md:py-7 border-b border-border-one border-opacity-70 relative last:border-b-0">
        {/* Image & Remove */}
        <div className="relative shrink-0 w-[90px] md:w-[100px] h-[90px] md:h-[100px] rounded-[16px] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            loading="eager"
            className="object-cover p-2 w-full h-full"
          />
          <button
            onClick={onRemove}
            disabled={isRemoving}
            className="absolute top-1 right-1 p-1 bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Details */}
        <div className="flex items-start justify-between w-full overflow-hidden">
          <div className="pl-3 md:pl-4 flex-1">
            <a
              href="#"
              className="block leading-5 text-13px sm:text-sm lg:text-15px hover:text-brand transition"
            >
              {title}
            </a>
            <div className="text-13px sm:text-sm text-gray-500 mt-1.5 mb-2">
              1 kg × {quantity}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={onDecrement}
                disabled={isUpdatingQuantity || quantity <= 1}
                className="flex items-center justify-center w-6 h-6 border border-border-three rounded-full hover:bg-brand hover:text-white transition disabled:opacity-50"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="w-9 text-center font-semibold">{quantity}</span>
              <button
                onClick={onIncrement}
                disabled={isUpdatingQuantity}
                className="flex items-center justify-center w-6 h-6 border border-border-three rounded-full hover:bg-brand hover:text-white transition disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="font-semibold text-sm md:text-base leading-5 shrink-0 min-w-[65px] md:min-w-[80px] text-right">
            ${price.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProductCart;
