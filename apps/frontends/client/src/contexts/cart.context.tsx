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
  updateQuantity: (id: string, newQty: number) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const LS_KEY = "my_app_cart";

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  // 1️⃣ Initialize state from localStorage (lazy initializer)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // 2️⃣ Whenever `cart` changes, write it back to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  }, [cart]);

  // 3️⃣ addToCart: if item exists, bump quantity; else push new
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        const newCart = [...prev];
        newCart[idx] = {
          ...newCart[idx],
          quantity: newCart[idx].quantity + item.quantity
        };
        return newCart;
      } else {
        return [...prev, { ...item }];
      }
    });
  };

  // 4️⃣ removeFromCart: drop item by id
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  // 5️⃣ clearCart: empty array
  const clearCart = () => {
    setCart([]);
  };

  // 6️⃣ updateQuantity: set absolute quantity (not delta)
  const updateQuantity = (id: string, newQty: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}
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
