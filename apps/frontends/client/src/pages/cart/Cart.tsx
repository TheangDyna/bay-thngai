import CardProductCart from "@/components/commons/CardProductCart";
import EmptyCartSection from "@/components/commons/EmptyCartSection";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart.context";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

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
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
          {totalQty > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {totalQty}
            </span>
          )}
          <span className="sr-only">Shopping cart</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Shopping Cart</SheetTitle>
            {cart.length > 0 && (
              <Button
                variant="link"
                onClick={handleClear}
                className="text-destructive hover:text-destructive p-0"
              >
                <span>Clear All</span>
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            {cart.length === 0 ? (
              <EmptyCartSection />
            ) : (
              <div className="space-y-1">
                {cart.map((item) => (
                  <CardProductCart
                    key={item.id}
                    imageUrl={item.image}
                    title={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    onRemove={() => handleRemove(item.id)}
                    onIncrement={() => handleIncrement(item.id)}
                    onDecrement={() => handleDecrement(item.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
        {totalQty > 0 && (
          <p className="w-full text-right text-sm text-muted-foreground">
            {totalQty} {totalQty === 1 ? "item" : "items"} in your cart
          </p>
        )}
        {cart.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <Button onClick={handleCheckout} className="w-full" size="lg">
              Proceed to Checkout
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Shipping and taxes calculated at checkout
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
