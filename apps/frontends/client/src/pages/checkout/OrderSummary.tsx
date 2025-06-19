// src/pages/checkout/OrderSummary.tsx
import { Button } from "@/components/ui/button";
import { CartItem } from "@/contexts/cart.context";
import { SectionCard } from "@/pages/checkout/SectionCard";
import { calculateDiscountedPrice } from "@/utils/price";
import React from "react";

interface OrderSummaryProps {
  cart: CartItem[];
  subtotal: number; // original sum of (price × qty)
  shippingFee: number;
  tipAmount: number;
  total: number; // already includes discount, shipping & tip
  onPlaceOrder: () => void;
  loading: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  subtotal,
  shippingFee,
  tipAmount,
  total,
  onPlaceOrder,
  loading
}) => {
  // Compute total discount across all cart items:
  const totalDiscount = cart.reduce((acc, item) => {
    const { price: basePrice, discount, quantity } = item;
    const { finalPrice } = calculateDiscountedPrice(basePrice, discount);
    return acc + (basePrice - finalPrice) * quantity;
  }, 0);

  return (
    <SectionCard title="Order Summary">
      <div className="space-y-4">
        {cart.map((item) => {
          const {
            id,
            name,
            image,
            price: basePrice,
            discount,
            quantity
          } = item;
          const { isDiscountActive, finalPrice } = calculateDiscountedPrice(
            basePrice,
            discount
          );
          const lineTotal = finalPrice * quantity;

          return (
            <div key={id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={image}
                  alt={name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <p className="font-medium">{name}</p>
                  <div className="flex items-baseline space-x-2 text-sm text-muted-foreground">
                    <span>
                      {quantity} × ${finalPrice.toFixed(2)}
                    </span>
                    {isDiscountActive && (
                      <del className="text-xs">${basePrice.toFixed(2)}</del>
                    )}
                  </div>
                </div>
              </div>
              <p className="font-semibold">${lineTotal.toFixed(2)}</p>
            </div>
          );
        })}

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {totalDiscount > 0 && (
            <div className="flex justify-between">
              <span>Total Discount</span>
              <span>${totalDiscount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shippingFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tip</span>
            <span>${tipAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          onClick={onPlaceOrder}
          disabled={loading}
          className="mt-6 w-full"
        >
          {loading ? "Processing…" : "Place Order"}
        </Button>
      </div>
    </SectionCard>
  );
};
