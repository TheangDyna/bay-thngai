import {
  useMutation,
  UseMutationResult,
  useQuery
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { useState } from "react";

export const useCreateProductMutation = (): {
  mutation: UseMutationResult<any, any, any>;
  progress: number;
} => {
  const [progress, setProgress] = useState<number>(0);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentage);
        }
      });
      return response.data;
    },
    onSettled: () => {
      setProgress(0);
    }
  });

  return { mutation, progress };
};

export const useProductsQuery = ({ pagination, sorting, columnFilters }) => {
  return useQuery<any, any>({
    queryKey: ["products", { pagination, sorting, columnFilters }],
    queryFn: async () => {
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sort: sorting[0]
          ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
          : undefined,
        ...columnFilters.reduce((acc, filter) => {
          acc[filter.id] = filter.value;
          return acc;
        }, {})
      };

      const response = await axiosInstance.get("/products", { params });
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
