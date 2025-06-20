import axiosInstance from "@/utils/axiosInstance";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

export const useGetWishlistQuery = (options?: { skip?: boolean }) => {
  return useInfiniteQuery({
    queryKey: ["wishlists"],
    queryFn: async ({ pageParam = 1 }) => {
      const params: Record<string, any> = {
        page: pageParam,
        limit: 10,
        select: "name,price,thumbnail"
      };
      const response = await axiosInstance.get("/auth/me/wishlists", {
        params
      });

      return response.data; // Returns { status, data: Product[], total }
    },
    getNextPageParam: (last, pages) =>
      pages.length * 10 < last.total ? pages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: !options?.skip
  });
};

export const useAddToWishlistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await axiosInstance.post("/auth/me/wishlists", {
        productId
      });
      return response.data; // Returns added productId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlists"] });
    }
  });
};

export const useRemoveFromWishlistMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      await axiosInstance.delete(`/auth/me/wishlists/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlists"] });
    }
  });
};
