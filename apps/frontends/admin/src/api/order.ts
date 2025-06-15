import { Order } from "@/types/order.types";
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

// Query to Fetch Orders with Filters
export const useOrdersQuery = ({
  pagination,
  sorting,
  columnFilters
}: {
  pagination: Pagination;
  sorting: Sorting[];
  columnFilters: ColumnFilter[];
}): UseQueryResult<{ data: Order[]; total: number }, AxiosError> => {
  return useQuery({
    queryKey: ["orders", { pagination, sorting, columnFilters }],
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

      const response = await axiosInstance.get("/orders", { params });
      return response.data;
    }
  });
};

// Query to Fetch a Single Order
export const useOrderQuery = (
  id?: string
): UseQueryResult<{ data: Order }, AxiosError> => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/orders/${id}`);
      return response.data;
    },
    enabled: !!id // Only fetch if `id` is provided
  });
};

// Mutation to Update Order
export const useUpdateOrderMutation = (
  id: string
): {
  mutation: UseMutationResult<Order, AxiosError, FormData>;
  progress: number;
} => {
  const [progress, setProgress] = useState<number>(0);
  const queryClient = useQueryClient();

  const mutation = useMutation<Order, AxiosError, FormData>({
    mutationFn: async (data) => {
      const response = await axiosInstance.patch(`/orders/${id}`, data, {
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
      // Invalidate the orders query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Invalidate the specific order query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
    },
    onSettled: () => {
      setProgress(0); // Reset progress after mutation is complete
    }
  });

  return { mutation, progress };
};

// Mutation to Delete Order
export const useDeleteOrderMutation = (
  id: string
): UseMutationResult<void, AxiosError> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });
};

// Mutation to Update Delivery Status
export const useUpdateDeliveryStatusMutation = (): UseMutationResult<
  Order,
  AxiosError,
  { orderId: string; status: Order["deliveryStatus"] }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await axiosInstance.patch(
        `/orders/${orderId}/delivery-status`,
        {
          status
        }
      );
      return response.data;
    },
    onSuccess: (updatedOrder) => {
      // Invalidate orders list and specific order cache
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", updatedOrder._id] });
    }
  });
};
