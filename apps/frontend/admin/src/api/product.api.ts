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
          console.log(acc);
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
