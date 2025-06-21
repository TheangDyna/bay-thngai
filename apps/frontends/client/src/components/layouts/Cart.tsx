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
import { useAuth } from "@/contexts/auth.context";
import { useCart } from "@/contexts/cart.context";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce(
    (sum, i) =>
      sum +
      i.quantity *
        i.price *
        (i.discount && i.discount.active
          ? 1 -
            (i.discount.type === "percentage"
              ? i.discount.amount / 100
              : i.discount.amount / i.price)
          : 1),
    0
  );

  const inc = (id: string) => {
    const it = cart.find((c) => c.id === id);
    if (it) addToCart({ ...it, quantity: 1 });
  };
  const dec = (id: string) => {
    const it = cart.find((c) => c.id === id);
    if (it) addToCart({ ...it, quantity: -1 });
  };
  const rmv = (id: string) => removeFromCart(id);
  const clr = () => clearCart();
  const ck = () => {
    if (!cart.length) {
      toast({
        variant: "destructive",
        description: "Your cart is empty"
      });
      return;
    }
    if (!user) {
      toast({
        variant: "destructive",
        description: "Please sign in to proceed to checkout.",
        action: (
          <Button
            variant="link"
            className="text-secondary"
            size="sm"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        )
      });
      return;
    }
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalQty > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {totalQty}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b pb-4">
          <div className="flex flex-1 items-center justify-between pr-4">
            <SheetTitle>Shopping Cart</SheetTitle>
            {cart.length > 0 && (
              <Button
                variant="link"
                onClick={clr}
                className="p-0 text-destructive"
              >
                Clear All
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
                    item={item}
                    onIncrement={() => inc(item.id)}
                    onDecrement={() => dec(item.id)}
                    onRemove={() => rmv(item.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {cart.length > 0 && (
          <>
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold text-base">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Button onClick={ck} className="w-full mt-4">
                Proceed to Checkout
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Shipping and taxes calculated at checkout
            </p>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
