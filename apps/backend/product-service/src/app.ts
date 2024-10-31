import express from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "@/src/routes/v1/routes";
import fs from "fs";
import path from "path";
import { globalErrorHandler } from "./middlewares/global-error";

// Dynamically load swagger.json
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "docs/swagger.json"), "utf8")
);

// Initialize App Express
const app = express();

// Global Middleware
app.use(express.json()); // Help to get the json from request body

// API Documentations
app.use(
  "/v1/products/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Global API V1
RegisterRoutes(app);

// ERROR Handler
app.use(globalErrorHandler);

export default app;
