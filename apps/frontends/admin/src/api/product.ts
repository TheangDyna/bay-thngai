import { Pagination } from "@/types/pagination.types";
import { Product } from "@/types/product.types";
import { Sorting } from "@/types/sort.types";
import axiosInstance from "@/utils/axiosInstance";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult
} from "@tanstack/react-query";
import { ColumnFilter } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { useState } from "react";

// Mutation to Create Product
export const useCreateProductMutation = (): {
  mutation: UseMutationResult<Product, AxiosError, FormData>;
  progress: number;
} => {
  const [progress, setProgress] = useState<number>(0);
  const queryClient = useQueryClient();

  const mutation = useMutation<Product, AxiosError, FormData>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentage);
        }
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the products query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onSettled: () => {
      setProgress(0); // Reset progress after mutation is complete
    }
  });

  return { mutation, progress };
};

// Query to Fetch Products with Filters
export const useProductsQuery = ({
  pagination,
  sorting,
  columnFilters
}: {
  pagination: Pagination;
  sorting: Sorting[];
  columnFilters: ColumnFilter[];
}): UseQueryResult<{ data: Product[]; total: number }, AxiosError> => {
  return useQuery({
    queryKey: ["products", { pagination, sorting, columnFilters }],
    queryFn: async () => {
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sort: sorting[0]
          ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
          : undefined,
        ...columnFilters.reduce((acc, filter) => {
          (acc as any)[filter.id] = filter.value;
          return acc;
        }, {})
      };

      const response = await axiosInstance.get("/products", { params });
      return response.data;
    }
  });
};

// Query to Fetch a Single Product
export const useProductQuery = (
  id?: string
): UseQueryResult<{ data: Product }, AxiosError> => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id // Only fetch if `id` is provided
  });
};

// Mutation to Update Product
export const useUpdateProductMutation = (
  id: string
): {
  mutation: UseMutationResult<Product, AxiosError, FormData>;
  progress: number;
} => {
  const [progress, setProgress] = useState<number>(0);
  const queryClient = useQueryClient();

  const mutation = useMutation<Product, AxiosError, FormData>({
    mutationFn: async (data) => {
      const response = await axiosInstance.patch(`/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentage);
        }
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the products query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // Invalidate the specific product query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
    onSettled: () => {
      setProgress(0); // Reset progress after mutation is complete
    }
  });

  return { mutation, progress };
};

// Mutation to Delete Product
export const useDeleteProductMutation = (
  id: string
): UseMutationResult<void, AxiosError> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
};

export const useProductsQueryLite = (search: string) => {
  return useQuery({
    queryKey: ["products-lite", search],
    queryFn: async () => {
      const res = await axiosInstance.get("/products", {
        params: { search }
      });
      return res.data.data;
    }
  });
};
