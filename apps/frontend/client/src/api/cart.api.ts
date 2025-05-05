import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import type { AxiosError } from "axios";
import { ICart } from "@/types/cart.type";

export const useGetCartQuery = (): UseQueryResult<ICart, AxiosError> => {
  return useQuery<ICart, AxiosError>({
    queryKey: ["carts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/carts");
      return res.data.data as ICart;
    }
  });
};

export const useAddToCartMutation = (): UseMutationResult<
  ICart[],
  AxiosError,
  { productId: string; quantity?: number }
> => {
  const queryClient = useQueryClient();

  return useMutation<
    ICart[],
    AxiosError,
    { productId: string; quantity?: number }
  >({
    mutationFn: async ({ productId, quantity = 1 }) => {
      const res = await axiosInstance.post("/carts", { productId, quantity });
      return res.data.data as ICart[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    }
  });
};

export const useRemoveFromCartMutation = (): UseMutationResult<
  ICart[],
  AxiosError,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation<ICart[], AxiosError, string>({
    mutationFn: async (productId: string) => {
      const res = await axiosInstance.delete(`/carts/${productId}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    }
  });
};

export const useClearCartMutation = (): UseMutationResult<
  void,
  AxiosError,
  void
> => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, void>({
    mutationFn: async () => {
      await axiosInstance.delete("/carts"); // assuming you have this endpoint
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    }
  });
};
