import express, { Express, Request, Response } from "express";
import applyProxy from "./middlewares/proxy";
import cors from "cors";
import corsOptions from "./middlewares/cors";
import { apiLimiter } from "./middlewares/limiter";
import { globalErrorHandler } from "./middlewares/global-error";
import {
  authenticateToken,
  authorizeRole,
  routeConfigMiddleware
} from "./middlewares/auth";
import cookieParser from "cookie-parser";

// Initialize App Express
const app: Express = express();

// Security Middleware
app.use(cors(corsOptions));

// Parse Cookie
app.use(cookieParser());

// Health check endpoint
app.get("/v1/api-gateway/health", (_: Request, res: Response) => {
  res.status(200).send({ message: "OK" });
});

// Apply rate limit to all routes
app.use("/v1/", apiLimiter);

// Auth Middleware
app.use(routeConfigMiddleware);
app.use(authenticateToken);
app.use(authorizeRole);

// Proxy Routes
applyProxy(app);

// Error handling middleware
app.use(globalErrorHandler);

export default app;
