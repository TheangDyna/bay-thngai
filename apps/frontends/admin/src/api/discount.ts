import { Discount, DiscountInput } from "@/types/discount.types";
import axiosInstance from "@/utils/axiosInstance";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult
} from "@tanstack/react-query";
import { AxiosError } from "axios";

// ✅ Create Discount
export const useCreateDiscountMutation = (): {
  mutation: UseMutationResult<Discount, AxiosError, DiscountInput>;
} => {
  const queryClient = useQueryClient();
  const mutation = useMutation<Discount, AxiosError, DiscountInput>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/discounts", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    }
  });

  return { mutation };
};

// ✅ Update Discount
export const useUpdateDiscountMutation = (
  id: string
): {
  mutation: UseMutationResult<Discount, AxiosError, Partial<DiscountInput>>;
} => {
  const queryClient = useQueryClient();

  return {
    mutation: useMutation<Discount, AxiosError, Partial<DiscountInput>>({
      mutationFn: async (data) => {
        const res = await axiosInstance.patch(`/discounts/${id}`, data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["discounts"] });
        queryClient.invalidateQueries({ queryKey: ["discounts", id] });
      }
    })
  };
};

// ✅ Get All Discounts
export const useDiscountsQuery = ({
  pagination,
  sorting,
  columnFilters
}: {
  pagination: { pageIndex: number; pageSize: number };
  sorting: { id: string; desc: boolean }[];
  columnFilters: { id: string; value: any }[];
}): UseQueryResult<{ data: Discount[]; total: number }, AxiosError> => {
  const params = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort: sorting[0]
      ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
      : undefined,
    ...columnFilters.reduce(
      (acc, filter) => {
        acc[filter.id] = filter.value;
        return acc;
      },
      {} as Record<string, any>
    )
  };

  return useQuery({
    queryKey: ["discounts", pagination, sorting, columnFilters],
    queryFn: async () => {
      const res = await axiosInstance.get("/discounts", { params });
      return res.data;
    }
  });
};

// ✅ Get One Discount
export const useDiscountQuery = (
  id?: string
): UseQueryResult<{ data: Discount }, AxiosError> => {
  return useQuery({
    queryKey: ["discounts", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/discounts/${id}`);
      return res.data;
    },
    enabled: !!id
  });
};

// ✅ Assign Discount to Products
export const useAssignDiscountMutation = (): UseMutationResult<
  void,
  AxiosError,
  { discountId: string; productIds: string[] }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      await axiosInstance.post("/discounts/assign", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
};
