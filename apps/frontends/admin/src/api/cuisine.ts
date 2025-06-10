import { Cuisine } from "@/types/cuisine.types";
import { Pagination } from "@/types/pagination.types";
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

// ───── Create Cuisine (with thumbnail) ───────────────────────────────────────
export const useCreateCuisineMutation = (): {
  mutation: UseMutationResult<Cuisine, AxiosError, FormData>;
  progress: number;
} => {
  const [progress, setProgress] = useState<number>(0);
  const queryClient = useQueryClient();

  const mutation = useMutation<Cuisine, AxiosError, FormData>({
    mutationFn: async (formData) => {
      const res = await axiosInstance.post("/cuisines", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / (e.total ?? 1));
          setProgress(pct);
        }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cuisines"] });
    },
    onSettled: () => {
      setProgress(0);
    }
  });

  return { mutation, progress };
};

// ───── Fetch All Cuisines ────────────────────────────────────────────────────
export const useCuisinesQuery = ({
  pagination,
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
      const params: any = {
        page:
          pagination?.pageIndex != null ? pagination.pageIndex + 1 : undefined,
        limit: pagination?.pageSize,
        sort: sorting[0]
          ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
          : undefined,
        ...columnFilters.reduce((acc, f) => {
          (acc as any)[f.id] = f.value;
          return acc;
        }, {})
      };
      const res = await axiosInstance.get("/cuisines", { params });
      return res.data;
    }
  });
};

// ───── Fetch Single Cuisine ─────────────────────────────────────────────────
export const useCuisineQuery = (
  id: string
): UseQueryResult<{ data: Cuisine }, AxiosError> => {
  return useQuery({
    queryKey: ["cuisines", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/cuisines/${id}`);
      return res.data;
    },
    enabled: !!id
  });
};

// ───── Update Cuisine (with thumbnail) ──────────────────────────────────────
export const useUpdateCuisineMutation = (
  id: string
): {
  mutation: UseMutationResult<Cuisine, AxiosError, FormData>;
  progress: number;
} => {
  const [progress, setProgress] = useState<number>(0);
  const queryClient = useQueryClient();

  const mutation = useMutation<Cuisine, AxiosError, FormData>({
    mutationFn: async (formData) => {
      const res = await axiosInstance.patch(`/cuisines/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / (e.total ?? 1));
          setProgress(pct);
        }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cuisines"] });
      queryClient.invalidateQueries({ queryKey: ["cuisines", id] });
    },
    onSettled: () => {
      setProgress(0);
    }
  });

  return { mutation, progress };
};

// ───── Delete Cuisine ────────────────────────────────────────────────────────
export const useDeleteCuisineMutation = (
  id: string
): UseMutationResult<void, AxiosError, void, unknown> => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, void, unknown>({
    mutationFn: async () => {
      await axiosInstance.delete(`/cuisines/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cuisines"] });
    }
  });
};
