import { User } from "@/types/User";
import axiosInstance from "@/utils/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Define UserInfo type or import it if it exists elsewhere
export type UserInfo = User;

export function useUpdateUserInfoMutation() {
  const queryClient = useQueryClient();
  return useMutation<UserInfo, Error, Partial<User>>({
    mutationFn: (payload: Partial<User>) =>
      axiosInstance
        .patch<{ status: string; data: UserInfo }>("/auth/me/info", payload)
        .then((res) => res.data.data),
    onSuccess: (updatedUser: UserInfo) => {
      queryClient.setQueryData<UserInfo>(["auth", "me"], updatedUser);
    }
  });
}
