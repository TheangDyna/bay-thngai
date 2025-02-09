import "dotenv/config";
import express from "express";
import { productRoutes } from "./routes/product.routes";
import { authRoutes } from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { routeNotFound } from "./middlewares/route.middleware";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./middlewares/rateLimiter.middleware";
import helmet from "helmet";
import cors from "cors";
import { userRoutes } from "./routes/user.routes";
import { cuisineRoutes } from "./routes/cuisine.routes";
import { cartRoutes } from "./routes/cart.routes";
import { orderRoutes } from "./routes/order.routes";
import { reviewRoutes } from "./routes/review.routes";
import { config } from "./configs/config";

const app = express();

// Security middleware
app.use("/api", rateLimiter);
app.use(helmet());
app.use(
  cors({
    origin: [config.adminUrl, "http://localhost:3000"],
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

// API Documentation
// if (config.nodeEnv === 'development') {
//   const swaggerDocument = YAML.load('./src/swagger/swagger.yaml');
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// }

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/cuisines", cuisineRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// Error handling
app.use(routeNotFound);
app.use(errorHandler);

export default app;
