import { config } from "@/src/configs/config";
import { OrderDoc } from "@/src/models/order.model";
import { Server as HTTPServer } from "http";
import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: [config.adminUrl, config.clientUrl],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("⚡️ Socket connected:", socket.id);

    socket.on("join", (tranId: string) => {
      console.log(`🚚 Joining room: ${tranId}`);
      socket.join(tranId);
    });

    socket.on("disconnect", (reason) => {
      console.log(`🛑 Disconnected: ${reason}`);
    });
  });
};

export const emitOrderUpdate = (tranId: string, order: OrderDoc) => {
  if (io) io.to(tranId).emit("order:update", order);
};

export const emitRiderLocation = (
  tranId: string,
  coords: { lat: number; lng: number }
) => {
  if (io) io.to(tranId).emit("rider:location", coords);
};
