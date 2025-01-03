import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

export const useLoginMutation = () => {
  return useMutation<any, any, any>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/login", data);
      return response.data;
    }
  });
};

export const useGoogleLoginMutation = () => {
  return useMutation<any, any, any>({
    mutationFn: async () => {
      const response = await axiosInstance.get("/auth/google");
      return response.data;
    }
  });
};

export const useGetMeQuery = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    },
    retry: false
  });
};

export const useLogoutMutation = () =>
  useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
    }
  });
