// src/contexts/cart.context.tsx
import type { Discount } from "@/types/discount.types";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";

export interface CartItem {
  id: string;
  name: string;
  // base, pre-discount price per unit
  price: number;
  // discount object (may be undefined)
  discount?: Discount;
  quantity: number;
  image: string;
}

interface CartContextValue {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const LS_KEY = "my_app_cart";

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        const existing = prev[idx];
        const newQty = existing.quantity + item.quantity;
        if (newQty <= 0) {
          return prev.filter((i) => i.id !== item.id);
        }
        const newCart = [...prev];
        newCart[idx] = {
          ...existing,
          quantity: newQty,
          // keep the same discount object
          discount: existing.discount
        };
        return newCart;
      }
      if (item.quantity > 0) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
