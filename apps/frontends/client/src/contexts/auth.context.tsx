// src/contexts/auth.context.tsx
import {
  useConfirmRegisterMutation,
  useGetMeQuery,
  useGoogleLoginMutation,
  useLoginMutation,
  useLogoutMutation,
  useResendConfirmCodeMutation,
  useSignupMutation
} from "@/api/auth";
import { User } from "@/types/User";
import { SignupInput } from "@/types/auth.types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ConfirmRegisterInput {
  email: string;
  code: string;
}

interface ResendConfirmInput {
  email: string;
}

interface AuthContextType {
  user: User | null;
  signup: (data: SignupInput) => Promise<void>;
  confirmRegister: (data: ConfirmRegisterInput) => Promise<void>;
  resendConfirmCode: (data: ResendConfirmInput) => Promise<void>; // ← new
  login: (data: { email: string; password: string }) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { data, refetch, isFetching } = useGetMeQuery();
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();
  const confirmRegisterMutation = useConfirmRegisterMutation();
  const resendConfirmCodeMutation = useResendConfirmCodeMutation(); // ← new
  const googleLoginMutation = useGoogleLoginMutation();
  const logoutMutation = useLogoutMutation();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (data?.status === "success" && data.data) {
      setUser(data.data);
    } else {
      setUser(null);
    }
  }, [data]);

  const signup = async (credentials: SignupInput) => {
    const { confirmPassword, ...rest } = credentials;
    await signupMutation.mutateAsync(rest);
    // OTP sent—user remains null until confirmRegister
  };

  const confirmRegister = async (payload: ConfirmRegisterInput) => {
    await confirmRegisterMutation.mutateAsync(payload);
    const result = await refetch();
    if (result.data?.status === "success" && result.data.data) {
      setUser(result.data.data);
    }
  };

  const resendConfirmCode = async (payload: ResendConfirmInput) => {
    await resendConfirmCodeMutation.mutateAsync(payload);
    // OTP resent to email
  };

  const login = async (credentials: { email: string; password: string }) => {
    await loginMutation.mutateAsync(credentials);
    const result = await refetch();
    if (result.data?.status === "success" && result.data.data) {
      setUser(result.data.data);
    }
  };

  const googleLogin = async () => {
    const response = await googleLoginMutation.mutateAsync({});
    if (typeof response.data === "string") {
      window.location.href = response.data;
    } else {
      const result = await refetch();
      if (result.data?.status === "success" && result.data.data) {
        setUser(result.data.data);
      }
    }
  };

  const logout = async () => {
    await logoutMutation.mutateAsync({});
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        confirmRegister,
        resendConfirmCode, // ← new
        login,
        googleLogin,
        logout,
        isLoading: isFetching
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
