// src/contexts/cart.context.tsx

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
  price: number;
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
  // 1️⃣ Initialize from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // 2️⃣ Persist on change
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  }, [cart]);

  // 3️⃣ addToCart: bump existing or add new; if qty ≤ 0, remove
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);

      // existing item
      if (idx !== -1) {
        const existing = prev[idx];
        const newQty = existing.quantity + item.quantity;

        // auto-remove if zero or less
        if (newQty <= 0) {
          return prev.filter((i) => i.id !== item.id);
        }

        const newCart = [...prev];
        newCart[idx] = { ...existing, quantity: newQty };
        return newCart;
      }

      // new item: only add if positive quantity
      if (item.quantity > 0) {
        return [...prev, { ...item }];
      }

      // ignore attempts to add zero or negative qty
      return prev;
    });
  };

  // 4️⃣ removeFromCart: explicit removal
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  // 5️⃣ clearCart: empty out
  const clearCart = () => {
    setCart([]);
  };

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
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};
