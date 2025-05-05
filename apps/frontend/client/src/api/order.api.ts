import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

interface CreateOrderPayload {
  cartId: string;
  total: number;
}

interface OrderResponse {
  _id: string;
  user: string;
  items: any[];
  total: number;
  paymentStatus: string;
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<{ data: OrderResponse }, Error, CreateOrderPayload>({
    mutationFn: ({ cartId, total }) =>
      axiosInstance
        .post<{ data: OrderResponse }>("/orders", { cartId, total })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });
};
