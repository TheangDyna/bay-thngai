import app from "./app";
import { config } from "./configs/config";
import { connectDatabase } from "./configs/database.config";
import logger from "./utils/logger";

const startServer = async (): Promise<void> => {
  try {
    connectDatabase();

    app.listen(config.port, () => {
      logger.info(
        `Server running in ${config.nodeEnv} mode on port ${config.port}`
      );
      logger.info(
        `Swagger documentation available at http://localhost:${config.port}/api-docs`
      );
    });
    process.on("unhandledRejection", (err: Error) => {
      logger.error("Unhandled Rejection:", err);
      process.exit(1);
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err: Error) => {
      logger.error("Uncaught Exception:", err);
      process.exit(1);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
