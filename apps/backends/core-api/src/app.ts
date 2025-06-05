import "dotenv/config";

// import "dotenv/config"; always on the top
import { cartRoutes } from "@/src/routes/cart.routes";
import { orderRoutes } from "@/src/routes/order.routes";
import { paymentRoutes } from "@/src/routes/payment.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { config } from "./configs/config";
import { errorHandler } from "./middlewares/error.middleware";
import { rateLimiter } from "./middlewares/rateLimiter.middleware";
import { routeNotFound } from "./middlewares/route.middleware";
import { authRoutes } from "./routes/auth.routes";
import { cuisineRoutes } from "./routes/cuisine.routes";
import { productRoutes } from "./routes/product.routes";
import { reviewRoutes } from "./routes/review.routes";
import { userRoutes } from "./routes/user.routes";

const app = express();

// Security middleware
app.use(rateLimiter);
app.use(helmet());
app.use(
  cors({
    origin: [config.adminUrl, config.clientUrl],
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);

// Error handling
app.use(routeNotFound);
app.use(errorHandler);

export default app;
