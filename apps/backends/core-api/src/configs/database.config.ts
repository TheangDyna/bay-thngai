import mongoose from "mongoose";
import { config } from "./config";
import logger from "../utils/logger";

export const connectDatabase = (): void => {
  try {
    mongoose.connect(config.mongoUri);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
