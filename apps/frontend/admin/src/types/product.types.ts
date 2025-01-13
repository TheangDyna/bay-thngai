import { z } from "zod";
import { ProductSchema } from "../validators/product.validators";

export type ProductInput = z.infer<typeof ProductSchema>;
