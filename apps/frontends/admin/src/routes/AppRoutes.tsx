import { DashboardLayout } from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/theme/ThemeContext";
import CuisineEdit from "@/pages/cuisines/CuisineEdit";
import Loading from "@/pages/Loading";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes
} from "react-router-dom";

// Lazy-loaded components
const Login = lazy(() => import("@/pages/auths/Login"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Dashboard = lazy(() => import("@/pages/dashboards/Dashboard"));
const ProductList = lazy(() => import("@/pages/products/ProductList"));
const ProductCreate = lazy(() => import("@/pages/products/ProductCreate"));
const CuisineCreate = lazy(() => import("@/pages/cuisines/CuisineCreate"));
const CuisineList = lazy(() => import("@/pages/cuisines/CuisineList"));
const ProductDetail = lazy(() => import("@/pages/products/ProductDetail"));
const ProductEdit = lazy(() => import("@/pages/products/ProductEdit"));

const queryClient = new QueryClient();

const AppRoutes: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public Routes */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Outlet />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              >
                {/* Dashboard */}
                <Route path="dashboard" element={<Dashboard />} />

                {/* Products Route */}
                <Route path="products" element={<Outlet />}>
                  <Route index element={<ProductList />} />
                  <Route path=":productId" element={<ProductDetail />} />
                  <Route path="new" element={<ProductCreate />} />
                  <Route path=":productId/edit" element={<ProductEdit />} />
                </Route>

                {/* Cuisines Route */}
                <Route path="cuisines">
                  <Route index element={<CuisineList />} />
                  <Route
                    path=":cuisineId"
                    element={<div>Cuisine Detail</div>}
                  />
                  <Route path="new" element={<CuisineCreate />} />
                  <Route path=":cuisineId/edit" element={<CuisineEdit />} />
                </Route>
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppRoutes;
