import {
  useGetMeQuery,
  useGoogleLoginMutation,
  useLoginMutation,
  useLogoutMutation
} from "@/api/auth.api";
import { User } from "@/types/User";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: User | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data, refetch, isFetching } = useGetMeQuery();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const googleLoginMutation = useGoogleLoginMutation();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (data?.status === "success" && data.data) {
      setUser(data.data);
    } else {
      setUser(null);
    }
  }, [data]);

  const login = async (credentials: { email: string; password: string }) => {
    await loginMutation.mutateAsync(credentials);

    const result = await refetch();
    if (result.data?.status === "success" && result.data.data) {
      setUser(result.data.data);
    }
  };

  const googleLogin = async () => {
    const response = await googleLoginMutation.mutateAsync({});

    // redirect to Google OAuth if backend returns the URL
    if (typeof response.data === "string") {
      window.location.href = response.data;
    } else {
      // fallback if Google login is handled differently
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
