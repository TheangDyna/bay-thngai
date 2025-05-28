// src/stores/cart.store.ts
import create from "zustand";
import axiosInstance from "@/utils/axiosInstance";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;

  // actions
  fetchCart: () => Promise<void>;
  addItem: (productId: string, qty: number) => Promise<void>;
  updateItem: (productId: string, qty: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/carts");
      const raw: any[] = res.data.data.items;
      const items = raw.map((i) => ({
        id: i.product._id,
        name: i.product.name,
        price: i.product.price,
        image: i.product.imageUrl,
        quantity: i.qty
      }));
      set({ items, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addItem: async (productId, qty) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/carts", { productId, qty });
      const raw: any[] = res.data.data.items;
      const items = raw.map((i) => ({
        id: i.product._id,
        name: i.product.name,
        price: i.product.price,
        image: i.product.imageUrl,
        quantity: i.qty
      }));
      set({ items, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateItem: async (productId, qty) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.patch("/carts", { productId, qty });
      const raw: any[] = res.data.data.items;
      const items = raw.map((i) => ({
        id: i.product._id,
        name: i.product.name,
        price: i.product.price,
        image: i.product.imageUrl,
        quantity: i.qty
      }));
      set({ items, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  removeItem: async (productId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.delete(`/carts/${productId}`);
      const raw: any[] = res.data.data.items;
      const items = raw.map((i) => ({
        id: i.product._id,
        name: i.product.name,
        price: i.product.price,
        image: i.product.imageUrl,
        quantity: i.qty
      }));
      set({ items, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete("/carts/clear");
      set({ items: [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  }
}));
