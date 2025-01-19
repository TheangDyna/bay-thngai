import { useState } from "react";

// Define CartItem type
export type CartItem = {
  id: number;
  image: string;
  title: string;
  price: number;  // Price is a number for easier calculations
  originalPrice?: string;
  unit: string;
  isOnSale?: boolean;
  quantity: number;
};

export const useCart = () => {
  const [cart, setCart] = useState<Record<string, CartItem>>({});

  const handleAddToCart = (productId: string, product: CartItem) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productId]) {
        updatedCart[productId].quantity += 1;
      } else {
        updatedCart[productId] = { ...product, quantity: 1 };
      }
      return updatedCart;
    });
  };

  return { cart, setCart, handleAddToCart };
};
