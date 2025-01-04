import {
  useMutation,
  UseMutationResult,
  useQuery
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

export const useCreateProductMutation = (): UseMutationResult<
  any,
  any,
  any
> => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/products", data);
      return response.data;
    }
  });
};

export const useProductsQuery = () => {
  return useQuery<any, any>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axiosInstance.get("/products");
      return response.data;
    }
  });
};

export const useProductQuery = (id: string) => {
  return useQuery<any, any>({
    queryKey: ["products", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id
  });
};

export const useUpdateProductMutation = (
  id: string
): UseMutationResult<any, any, any> => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.patch(`/products/${id}`, data);
      return response.data;
    }
  });
};

export const useDeleteProductMutation = (
  id: string
): UseMutationResult<void, any> => {
  return useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/products/${id}`);
    }
  });
};
