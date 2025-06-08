// src/pages/checkout/OrderSummary.tsx
import { Button } from "@/components/ui/button";
import { CartItem } from "@/contexts/cart.context";
import { SectionCard } from "@/pages/checkout/SectionCard";
import React from "react";

interface OrderSummaryProps {
  cart: CartItem[];
  subtotal: number;
  shippingFee: number;
  tipAmount: number;
  total: number;
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
}) => (
  <SectionCard title="Order Summary">
    <div className="space-y-4">
      {cart.map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded"
            />
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.quantity} × ${item.price.toFixed(2)}
              </p>
            </div>
          </div>
          <p className="font-semibold">
            ${(item.quantity * item.price).toFixed(2)}
          </p>
        </div>
      ))}

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
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

      <Button onClick={onPlaceOrder} disabled={loading} className="mt-6 w-full">
        {loading ? "Processing…" : "Place Order"}
      </Button>
    </div>
  </SectionCard>
);
