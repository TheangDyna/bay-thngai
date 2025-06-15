import { server } from "@/src/app";
import { config } from "@/src/configs/config";
import { connectDatabase } from "@/src/configs/database.config";
import logger from "@/src/utils/logger";
import http from "http";

const GRACEFUL_TIMEOUT = 10_000; // 10 seconds

async function startServer(): Promise<void> {
  // 1. Register global handlers early
  process.on("unhandledRejection", (reason: unknown) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    logger.error("Unhandled Rejection", {
      message: error.message,
      stack: error.stack
    });
    shutdown(1);
  });

  process.on("uncaughtException", (error: Error) => {
    logger.error("Uncaught Exception", {
      message: error.message,
      stack: error.stack
    });
    shutdown(1);
  });

  // 2. Connect to MongoDB
  await connectDatabase();

  // 3. Start HTTP server
  const httpServer = server.listen(config.port, () => {
    logger.info("Server started", {
      env: config.nodeEnv,
      port: config.port
    });
  });

  // 4. Handle OS signals for graceful shutdown
  process.on("SIGINT", () => {
    logger.info("SIGINT received, shutting down");
    shutdown(0, httpServer);
  });

  process.on("SIGTERM", () => {
    logger.info("SIGTERM received, shutting down");
    shutdown(0, httpServer);
  });
}

function shutdown(exitCode: number, httpServer?: http.Server) {
  // Stop accepting new connections
  if (httpServer) {
    httpServer.close(() => {
      logger.info("HTTP server closed");
    });
  }

  // Force exit if still not closed after timeout
  setTimeout(() => {
    logger.warn("Forcing shutdown after timeout");
    process.exit(exitCode);
  }, GRACEFUL_TIMEOUT);
}

startServer().catch((err) => {
  const error = err as Error;
  logger.error("Failed to start server", {
    message: error.message,
    stack: error.stack
  });
  process.exit(1);
});
