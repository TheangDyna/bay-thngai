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
