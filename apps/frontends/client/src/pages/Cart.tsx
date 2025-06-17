import CardProductCart from "@/components/commons/CardProductCart";
import EmptyCartSection from "@/components/commons/EmptyCartSection";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart.context";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, TrashIcon, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  const toggleSidebar = () => setIsSidebarOpen((o) => !o);
  const closeSidebar = () => setIsSidebarOpen(false);

  const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  const handleClear = () => {
    clearCart();
  };

  const handleIncrement = (id: string) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      addToCart({ ...item, quantity: 1 });
    }
  };

  const handleDecrement = (id: string) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      addToCart({ ...item, quantity: -1 });
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({ description: "Your cart is empty", variant: "destructive" });
      return;
    }
    // close drawer first
    setIsSidebarOpen(false);
    // then navigate
    navigate("/checkout");
  };

  return (
    <>
      <div>
        {/* Cart Icon */}
        <div
          onClick={toggleSidebar}
          className="relative flex items-center cursor-pointer"
        >
          <ShoppingCart />

          {totalQty > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-emerald-500 text-white text-xs rounded-full">
              {totalQty}
            </span>
          )}
        </div>

        {/* Sidebar */}
        <div
          className={`fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeSidebar}
        >
          <div
            className={`w-[378px] h-full bg-white flex flex-col transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Shopping Cart</h3>
              <div className="flex">
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
                    onDecrement={() => handleDecrement(it.id)}
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
      </div>
    </>
  );
};

export default Cart;
