// src/api/review.ts
import { Pagination } from "@/types/pagination.types";
import { RatingSummary, Review } from "@/types/review.types";
import { Sorting } from "@/types/sort.types";
import axiosInstance from "@/utils/axiosInstance";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult
} from "@tanstack/react-query";
import { ColumnFilter } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { toast } from "sonner";

// GET reviews by productId with pagination, sorting, filters
export const useReviewsQuery = ({
  productId,
  pagination,
  sorting,
  columnFilters
}: {
  productId: string;
  pagination: Pagination;
  sorting: Sorting[];
  columnFilters: ColumnFilter[];
}): UseQueryResult<{ data: Review[]; total: number }, AxiosError> => {
  return useQuery({
    queryKey: ["reviews", productId, pagination, sorting, columnFilters],
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

      const res = await axiosInstance.get(`/products/${productId}/reviews`, {
        params
      });
      return res.data;
    },
    enabled: !!productId
  });
};

export const useRatingSummaryQuery = (
  productId?: string
): UseQueryResult<{ data: RatingSummary }, AxiosError> =>
  useQuery({
    queryKey: ["rating-summary", productId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/products/${productId}/reviews/summary`
      );
      return res.data;
    },
    enabled: !!productId
  });

export const useSubmitReviewMutation = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { rating: number; review: string }) => {
      await axiosInstance.post(`/products/${productId}/reviews`, input);
    },
    onSuccess: () => {
      toast.success("Thanks for your feedback!", {
        duration: 3000
      });
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({
        queryKey: ["rating-summary", productId]
      });
    },
    onError: (err: AxiosError<any>) => {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(message, {
        duration: 5000
      });
    }
  });
};
