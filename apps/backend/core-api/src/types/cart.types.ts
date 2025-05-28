// src/types/cart.types.ts
export type CartItemDto = {
  productId: string;
  qty: number;
};

export type UpdateCartItemDto = {
  productId: string;
  qty: number;
};
