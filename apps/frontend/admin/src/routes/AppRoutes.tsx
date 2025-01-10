import React, { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ThemeProvider } from "@/contexts/theme/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Loading from "@/pages/Loading";

// Lazy-loaded components
const Login = lazy(() => import("@/pages/auths/Login"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Dashboard = lazy(() => import("@/pages/dashboards/Dashboard"));
const ProductList = lazy(() => import("@/pages/products/ProductList"));
const ProductCreate = lazy(() => import("@/pages/products/ProductCreate"));
const CuisineCreate = lazy(() => import("@/pages/cuisines/CuisineCreate"));

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
                  <Route
                    path=":productId"
                    element={<div>Product Detail</div>}
                  />
                  <Route path="new" element={<ProductCreate />} />
                  <Route
                    path=":productId/edit"
                    element={<div>Product Edit</div>}
                  />
                </Route>

                {/* Cuisines Route */}
                <Route path="cuisines" element={<Outlet />}>
                  <Route index element={<div>Cuisine List</div>} />
                  <Route
                    path=":cuisineId"
                    element={<div>Cuisine Detail</div>}
                  />
                  <Route path="new" element={<CuisineCreate />} />
                  <Route
                    path=":cuisineId/edit"
                    element={<div>Cuisine Edit</div>}
                  />
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
