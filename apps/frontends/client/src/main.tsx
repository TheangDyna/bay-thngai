import AppRoutes from "@/routes/AppRoutes.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>
);

// 2
