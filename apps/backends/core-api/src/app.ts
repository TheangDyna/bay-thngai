import "dotenv/config";

// import "dotenv/config"; always on the top
import { discountRoutes } from "@/routes/discount.routes";
import { orderRoutes } from "@/routes/order.routes";
import { paymentRoutes } from "@/routes/payment.routes";
import { pushSubscriptionRoutes } from "@/routes/pushSubscription.routes";
import { initSocket } from "@/socket";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";
import webpush from "web-push";
import { config } from "./configs/config";
import { errorHandler } from "./middlewares/error.middleware";
import { rateLimiter } from "./middlewares/rateLimiter.middleware";
import { routeNotFound } from "./middlewares/route.middleware";
import { authRoutes } from "./routes/auth.routes";
import { cuisineRoutes } from "./routes/cuisine.routes";
import { productRoutes } from "./routes/product.routes";
import { userRoutes } from "./routes/user.routes";

const app = express();
const server = http.createServer(app);
initSocket(server);

webpush.setVapidDetails(
  "mailto:your-support@yourdomain.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

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
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/push", pushSubscriptionRoutes);
app.use("/api/v1/discounts", discountRoutes);

// Error handling
app.use(routeNotFound);
app.use(errorHandler);

export { app, server };

// 2
