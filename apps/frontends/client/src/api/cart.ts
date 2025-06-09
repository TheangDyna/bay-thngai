import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { RawCart, CartItemDto } from "@/types/cart.types";

export const useGetCartQuery = () =>
  useQuery<RawCart>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axiosInstance.get("/carts");
      return res.data.data as RawCart;
    },
    staleTime: 1000 * 60 * 5
  });

export const useAddCartItemMutation = () => {
  const qc = useQueryClient();
  return useMutation<RawCart, any, CartItemDto>({
    mutationFn: (dto) =>
      axiosInstance.post("/carts", dto).then((res) => res.data.data),
    onSuccess: (data) => {
      qc.setQueryData(["cart"], data);
    }
  });
};

export const useUpdateCartItemMutation = () => {
  const qc = useQueryClient();
  return useMutation<RawCart, any, CartItemDto>({
    mutationFn: (dto) =>
      axiosInstance.patch("/carts", dto).then((res) => res.data.data),
    onSuccess: (data) => {
      qc.setQueryData(["cart"], data);
    }
  });
};

export const useRemoveCartItemMutation = () => {
  const qc = useQueryClient();
  return useMutation<RawCart, any, { productId: string }>({
    mutationFn: ({ productId }) =>
      axiosInstance.delete(`/cart/${productId}`).then((res) => res.data.data),
    onSuccess: (data) => {
      qc.setQueryData(["cart"], data);
    }
  });
};

export const useClearCartMutation = () => {
  const qc = useQueryClient();
  return useMutation<void, any>({
    mutationFn: () => axiosInstance.delete("/cart/clear"),
    onSuccess: () => {
      qc.setQueryData(["cart"], { items: [] });
    }
  });
};
