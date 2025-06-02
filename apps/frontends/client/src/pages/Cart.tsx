import React, { useState } from "react";
import { ShoppingCart, TrashIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardProductCart from "@/components/base/home/card/CardProductCart";
import EmptyCartSection from "@/components/base/home/section/EmptyCartSection";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import { PaywayIframe } from "@/pages/PaywayIframe";
import { useCart } from "@/contexts/cart.context";

const Cart: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [config, setConfig] = useState<null | {
    endpoint: string;
    payload: Record<string, string>;
  }>(null);

  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  const toggleSidebar = () => setIsSidebarOpen((o) => !o);
  const closeSidebar = () => setIsSidebarOpen(false);

  const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const handleRemove = (id: string) => {
    removeFromCart(id);
    toast({ description: "Item removed" });
  };

  const handleClear = () => {
    clearCart();
    toast({ description: "Cart cleared" });
  };

  const handleIncrement = (id: string) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      addToCart({ ...item, quantity: 1 });
    }
  };

  const handleDecrement = (id: string, qty: number) => {
    if (qty <= 1) return;
    const item = cart.find((i) => i.id === id);
    if (item) {
      addToCart({ ...item, quantity: -1 });
    }
  };

  const handleCheckout = async () => {
    const cartId = "local-cart";
    const rawTranId = cartId.slice(0, 20);

    const payload = {
      orderId: rawTranId,
      amount: subtotal,
      items: cart.map((i) => ({
        name: i.name,
        qty: i.quantity,
        price: i.price
      })),
      customer: {
        firstname: "Theang",
        lastname: "Dyna",
        email: "theangdyna365@gmail.com"
      }
    };

    try {
      const { data } = await axiosInstance.post("/payments/purchase", payload);
      setConfig(data);
    } catch {
      toast({ description: "Checkout failed", variant: "destructive" });
    }
  };

  return (
    <>
      <div>
        {/* Cart Icon */}
        <div
          onClick={toggleSidebar}
          className="relative flex items-center space-x-2 cursor-pointer"
        >
          <ShoppingCart className="w-6 h-6" />
          <span>Cart</span>
          {totalQty > 0 && (
            <span className="absolute -top-1 right-8 flex h-4 w-4 items-center justify-center bg-emerald-500 text-white text-xs rounded-full">
              {totalQty}
            </span>
          )}
        </div>

        {/* Sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50"
            onClick={closeSidebar}
          >
            <div
              className="w-[378px] h-full bg-white flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold">Shopping Cart</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={handleClear}
                    disabled={cart.length === 0}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" onClick={closeSidebar} size="icon">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Items */}
              <div className="flex-grow overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <EmptyCartSection />
                ) : (
                  cart.map((it) => (
                    <CardProductCart
                      key={it.id}
                      imageUrl={it.image}
                      title={it.name}
                      price={it.price}
                      quantity={it.quantity}
                      onRemove={() => handleRemove(it.id)}
                      onIncrement={() => handleIncrement(it.id)}
                      onDecrement={() => handleDecrement(it.id, it.quantity)}
                      isRemoving={false}
                      isUpdatingQuantity={false}
                    />
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payway Checkout iframe */}
      {config && (
        <PaywayIframe
          endpoint={config.endpoint}
          payload={config.payload}
          onClose={() => setConfig(null)}
        />
      )}
    </>
  );
};

export default Cart;
