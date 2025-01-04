import {
  useMutation,
  UseMutationResult,
  useQuery
} from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

export const useCreateCuisineMutation = (): UseMutationResult<
  any,
  any,
  any
> => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/cuisines", data);
      return response.data;
    }
  });
};

export const useCuisinesQuery = () => {
  return useQuery<any, any>({
    queryKey: ["cuisines"],
    queryFn: async () => {
      const response = await axiosInstance.get("/cuisines");
      return response.data;
    }
  });
};

export const useCuisineQuery = (id: string) => {
  return useQuery<any, any>({
    queryKey: ["cuisines", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/cuisines/${id}`);
      return response.data;
    },
    enabled: !!id
  });
};

export const useUpdateCuisineMutation = (
  id: string
): UseMutationResult<any, any, any> => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.patch(`/cuisines/${id}`, data);
      return response.data;
    }
  });
};

export const useDeleteCuisineMutation = (
  id: string
): UseMutationResult<void, any> => {
  return useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/cuisines/${id}`);
    }
  });
};
