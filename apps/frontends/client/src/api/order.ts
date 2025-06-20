import { config } from "@/configs/config";
import { Order } from "@/types/order.types";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

import { AxiosError } from "axios";

let socket: Socket | null = null;

export const useOrderTrackingSocket = (
  tranId: string,
  onOrderUpdate: (order: Order) => void,
  onRiderUpdate: (coords: [number, number]) => void
) => {
  useEffect(() => {
    if (!tranId) return;

    socket = io(config.apiUrl, {
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on("connect", () => {
      console.log("⚡️ Socket connected:", socket?.id);
      socket?.emit("join", tranId);
    });

    socket.on("disconnect", (reason) => {
      console.warn("🛑 Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });

    socket.on("order:update", onOrderUpdate);
    socket.on("rider:location", (loc: { lat: number; lng: number }) => {
      onRiderUpdate([loc.lat, loc.lng]);
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [tranId, onOrderUpdate, onRiderUpdate]);
};

export const useOrderTrackingQuery = (
  tranId?: string
): UseQueryResult<Order, AxiosError> => {
  return useQuery({
    queryKey: ["orders", tranId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/orders/${tranId}`);
      return response.data;
    },
    enabled: !!tranId
  });
};

import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetOrdersQuery = (
  query: { email: string; sort?: string },
  options?: { skip?: boolean }
) => {
  return useInfiniteQuery({
    queryKey: ["orders", query.email, query.sort],
    queryFn: async ({ pageParam = 1 }) => {
      const params: Record<string, any> = {
        page: pageParam,
        limit: 10, // Adjust as needed
        email: query.email
      };
      if (query.sort) params.sort = query.sort;

      const response = await axiosInstance.get("/orders/user", {
        params
      });
      return response.data; // Returns { status, total, results, data }
    },
    getNextPageParam: (last, pages) =>
      pages.length * 10 < last.total ? pages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: !options?.skip
  });
};
