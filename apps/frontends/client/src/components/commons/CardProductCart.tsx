import { MinusIcon, Plus, X } from "lucide-react";
import React from "react";

interface CardProductCartProps {
  imageUrl: string;
  title: string;
  price: number;
  quantity: number;
  onRemove: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

const CardProductCart: React.FC<CardProductCartProps> = ({
  imageUrl,
  title,
  price,
  quantity,
  onRemove,
  onIncrement,
  onDecrement
}) => {
  return (
    <div className="group w-full h-20 relative flex items-center gap-2 border-b last:border-b-0">
      <div className="w-20 h-w-20 bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover rounded-sm w-full h-full"
        />
      </div>

      <button
        onClick={onRemove}
        className="absolute top-0 right-2 p-1 rounded-full bg-destructive/25 opacity-0 group-hover:opacity-100 transition"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start justify-between h-full w-full p-2">
        <div className="h-full flex flex-col flex-1">
          <a href="#" className="font-medium">
            {title}
          </a>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 mt-auto">
            <button
              onClick={onDecrement}
              disabled={quantity <= 1}
              className="flex items-center justify-center w-6 h-6 border border-border-three rounded-full transition disabled:opacity-50"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="w-9 text-center font-semibold">{quantity}</span>
            <button
              onClick={onIncrement}
              className="flex items-center justify-center w-6 h-6 border border-border-three rounded-full transition disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="h-full flex flex-col items-end justify-end">
          <p className="text-sm text-muted-foreground">${price.toFixed(2)}</p>
          <p className="font-semibold">${(price * quantity).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default CardProductCart;
