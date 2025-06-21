import axiosInstance from "@/utils/axiosInstance";
import {
  useMutation,
  UseMutationResult,
  useQuery
} from "@tanstack/react-query";

export const useLoginMutation = (): UseMutationResult<any, any, any> => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/login", data);
      return response.data;
    }
  });
};

export const useGoogleLoginMutation = (): UseMutationResult<any, any, any> => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get("/auth/google?target=admin");
      return response.data;
    }
  });
};

export const useGetMeQuery = () => {
  return useQuery<any, any>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    },
    retry: false
  });
};

export const useLogoutMutation = (): UseMutationResult<any, any, any> =>
  useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
    }
  });
