import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

interface PurchasePayload {
  orderId: string;
  total: number;
}

interface PurchaseResponse {
  status: "success" | "error";
  data: string; // full HTML string
}

export const usePurchasePayment = () => {
  const queryClient = useQueryClient();
  return useMutation<PurchaseResponse, Error, PurchasePayload>({
    mutationFn: ({ orderId, total }) =>
      axiosInstance
        .post<PurchaseResponse>("/payments/purchase", {
          orderId,
          total
        })
        .then((res) => res.data),
    onSuccess: () => {
      // you might clear cache or cart here if desired
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });
};
