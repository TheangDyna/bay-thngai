// src/routes/order.routes.ts
import { OrderController } from "@/src/controllers/order.controller";
import { Router } from "express";

const router = Router();
const controller = new OrderController();

// POST /api/orders  → create a new order & return paymentConfig
router.post("/", controller.createOrder);

// GET /api/orders/:id  → fetch one order
router.get("/:id", controller.getOrderById);

// GET /api/orders  → list all orders
router.get("/", controller.listOrders);

export const orderRoutes = router;
