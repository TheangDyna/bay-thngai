import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/signin", data);
      return response.data;
    }
  });
};

export const useGetMeQuery = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data.data;
    },
    retry: false
  });
};

export const useLogoutMutation = () =>
  useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/auth/signout");
      return response.data;
    }
  });
