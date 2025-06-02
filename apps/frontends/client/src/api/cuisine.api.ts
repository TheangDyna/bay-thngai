import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { Cuisine, CuisineInput } from "@/types/cuisine.types";
import { AxiosError } from "axios";
import { useState } from "react";
import { Pagination } from "@/types/pagination.types";
import { Sorting } from "@/types/sort.types";
import { ColumnFilter } from "@tanstack/react-table";

// Create Cuisine Mutation
export const useCreateCuisineMutation = (): {
  mutation: UseMutationResult<Cuisine, AxiosError, CuisineInput>;
  progress: number;
} => {
  const [progress, setProgress] = useState<number>(0);

  const mutation = useMutation<Cuisine, AxiosError, CuisineInput>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/cuisines", data, {
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

// Get All Cuisines Query
export const useCuisinesQuery = ({
  pagination = { pageIndex: 0, pageSize: 100 },
  sorting = [],
  columnFilters = []
}: {
  pagination?: Pagination;
  sorting?: Sorting[];
  columnFilters?: ColumnFilter[];
}): UseQueryResult<{ data: Cuisine[]; total: number }, AxiosError> => {
  return useQuery({
    queryKey: ["cuisines", { pagination, sorting, columnFilters }],
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

// Update Cuisine Mutation
export const useUpdateCuisineMutation = (
  id: string
): UseMutationResult<Cuisine, AxiosError, Partial<CuisineInput>> => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.patch(`/cuisines/${id}`, data);
      return response.data;
    }
  });
};

// Delete Cuisine Mutation
export const useDeleteCuisineMutation = (
  id: string
): UseMutationResult<void, AxiosError> => {
  return useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/cuisines/${id}`);
    }
  });
};
