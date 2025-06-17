import { Pagination } from "@/types/pagination.types";
import { Product } from "@/types/product.types";
import { Sorting } from "@/types/sort.types";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ColumnFilter } from "@tanstack/react-table";
import { AxiosError } from "axios";

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
  productId?: string
): UseQueryResult<{ data: Product }, AxiosError> => {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data;
    },
    enabled: !!productId // Only fetch if `id` is provided
  });
};
