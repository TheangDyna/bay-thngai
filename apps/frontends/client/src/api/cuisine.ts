import { Cuisine } from "@/types/cuisine.types";
import { Pagination } from "@/types/pagination.types";
import { Sorting } from "@/types/sort.types";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ColumnFilter } from "@tanstack/react-table";
import { AxiosError } from "axios";

// Get All Cuisines Query
export const useCuisinesQuery = ({
  sorting = [],
  columnFilters = []
}: {
  pagination?: Pagination;
  sorting?: Sorting[];
  columnFilters?: ColumnFilter[];
}): UseQueryResult<{ data: Cuisine[]; total: number }, AxiosError> => {
  return useQuery({
    queryKey: ["cuisines", { sorting, columnFilters }],
    queryFn: async () => {
      const params = {
        sort: sorting[0]
          ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
          : undefined,
        ...columnFilters.reduce((acc, filter) => {
          (acc as any)[filter.id] = filter.value;
          return acc;
        }, {})
      };
      const response = await axiosInstance.get("/cuisines", { params });
      return response.data;
    }
  });
};

// Get Single Cuisine Query
export const useCuisineQuery = (
  id: string
): UseQueryResult<Cuisine, AxiosError> => {
  return useQuery({
    queryKey: ["cuisines", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/cuisines/${id}`);
      return response.data;
    },
    enabled: !!id
  });
};
