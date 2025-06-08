// src/pages/checkout/OrderSummary.tsx
import { Button } from "@/components/ui/button";
import { CartItem } from "@/contexts/cart.context";
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
  <aside className="space-y-6 lg:col-span-1">
    <div className="border rounded-md p-6 shadow-sm flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="divide-y flex-1">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center py-3">
            <div className="w-16 h-16 flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="object-cover w-full h-full rounded"
              />
            </div>
            <div className="ml-4 flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.quantity} × ${item.price.toFixed(2)}
              </p>
            </div>
            <p className="font-semibold">
              ${(item.quantity * item.price).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
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
  </aside>
);
