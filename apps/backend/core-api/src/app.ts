import express from "express";
import { productRoutes } from "./routes/product.routes";
import { AppError } from "./utils/appError";
import globalErrorHandler from "./middlewares/error.middleware";

const app = express();

// Security middleware
app.use(express.json());

// Swagger documentation
// const swaggerDocument = YAML.load('./src/swagger.yaml');
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/v1/products", productRoutes);

app.all("*", (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling
app.use(globalErrorHandler);

export default app;
