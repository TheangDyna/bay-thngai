import winston from "winston";
import { config } from "../configs/config";

const logger = winston.createLogger({
  level: config.nodeEnv === "development" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// uncomment in production
// if (config.nodeEnv === "production") {
//   logger.add(
//     new winston.transports.File({ filename: "logs/error.log", level: "error" })
//   );
//   logger.add(new winston.transports.File({ filename: "logs/combined.log" }));
// }

export default logger;
