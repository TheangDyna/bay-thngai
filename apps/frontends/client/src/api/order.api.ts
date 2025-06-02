// src/services/api/order.api.ts
import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { Order, PlaceOrderDto } from "@/types/order.types";
import { CartItem } from "@/hooks/useCart";

export const useGetCartQuery = (): UseQueryResult<CartItem, any> => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axiosInstance.get("/cart");
      return res.data;
    }
  });
};

export const usePlaceOrderMutation = (): UseMutationResult<
  Order,
  any,
  PlaceOrderDto
> => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: PlaceOrderDto) => {
      const res = await axiosInstance.post("/orders", dto);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    }
  });
};
