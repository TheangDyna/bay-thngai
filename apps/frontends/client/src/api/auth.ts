// src/api/auth.ts
import axiosInstance from "@/utils/axiosInstance";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult
} from "@tanstack/react-query";

export interface AddressRecord {
  _id: string;
  label: string;
  location: {
    type: "Point";
    coordinates: [number, number];
    address: string;
  };
}

// ─── AUTH MUTATIONS ─────────────────────────────────────────────────────────

export const useLoginMutation = (): UseMutationResult<any, any, any> => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/login", data);
      return response.data;
    }
  });
};

export const useSignupMutation = (): UseMutationResult<any, any, any> => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/register", data);
      return response.data;
    }
  });
};

export const useConfirmRegisterMutation = (): UseMutationResult<
  any,
  any,
  { email: string; code: string }
> => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/confirm-register", data);
      return response.data;
    }
  });
};

export const useResendConfirmCodeMutation = (): UseMutationResult<
  any,
  any,
  { email: string }
> => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        "/auth/resend-confirm-code",
        data
      );
      return response.data;
    }
  });
};

export const useGoogleLoginMutation = (): UseMutationResult<any, any, any> => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get("/auth/google");
      return response.data;
    }
  });
};

export const useGetMeQuery = (): UseQueryResult<any, any> => {
  return useQuery({
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

// ─── ADDRESS QUERIES & MUTATIONS ────────────────────────────────────────────

interface UserWithAddresses {
  id: string;
  data: AddressRecord[];
}

export const useGetAddressesQuery = (): UseQueryResult<
  AddressRecord[],
  Error
> => {
  return useQuery({
    queryKey: ["me", "addresses"],
    queryFn: async () => {
      const response =
        await axiosInstance.get<UserWithAddresses>(`/auth/me/addresses`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });
};

export const useAddAddressMutation = (): UseMutationResult<
  AddressRecord,
  Error,
  Omit<AddressRecord, "_id">
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newAddress) => {
      const response = await axiosInstance.post<AddressRecord>(
        `/auth/me/addresses`,
        newAddress
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "addresses"] });
    }
  });
};

export const useUpdateAddressMutation = (): UseMutationResult<
  AddressRecord,
  Error,
  AddressRecord
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updated) => {
      const { _id, label, location } = updated;
      const response = await axiosInstance.put<AddressRecord>(
        `/auth/me/addresses/${_id}`,
        { label, location }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "addresses"] });
    }
  });
};

export const useDeleteAddressMutation = (): UseMutationResult<
  { success: boolean },
  Error,
  { id: string }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }) => {
      const response = await axiosInstance.delete<{ success: boolean }>(
        `/auth/me/addresses/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "addresses"] });
    }
  });
};
