import { DashboardLayout } from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/theme/ThemeContext";
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
const Login = lazy(async () => await import("@/pages/auths/Login"));
const NotFound = lazy(async () => await import("@/pages/NotFound"));
const Dashboard = lazy(
  async () => await import("@/pages/dashboards/Dashboard")
);
const ProductList = lazy(
  async () => await import("@/pages/products/ProductList")
);
const ProductCreate = lazy(
  async () => await import("@/pages/products/ProductCreate")
);
const CuisineCreate = lazy(
  async () => await import("@/pages/cuisines/CuisineCreate")
);
const CuisineList = lazy(
  async () => await import("@/pages/cuisines/CuisineList")
);
const ProductDetail = lazy(
  async () => await import("@/pages/products/ProductDetail")
);
const ProductEdit = lazy(
  async () => await import("@/pages/products/ProductEdit")
);
const ComingSoon = lazy(async () => await import("@/pages/ComingSoon"));
const CuisineEdit = lazy(
  async () => await import("@/pages/cuisines/CuisineEdit")
);
const ApplyDiscount = lazy(
  async () => await import("@/pages/discounts/apply/ApplyDiscount")
);
const DiscountCreate = lazy(() => import("@/pages/discounts/DiscountCreate"));
const DiscountEdit = lazy(() => import("@/pages/discounts/DiscountEdit"));
const DiscountList = lazy(() => import("@/pages/discounts/DiscountList"));
const OrderList = lazy(() => import("@/pages/order/OrderList"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

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

                {/* Order Route */}
                <Route path="order">
                  <Route index element={<OrderList />} />
                </Route>

                {/* Discount */}
                <Route path="discount">
                  <Route index element={<DiscountList />} />
                  <Route path="new" element={<DiscountCreate />} />
                  <Route path="apply" element={<ApplyDiscount />} />
                  <Route path=":discountId/edit" element={<DiscountEdit />} />
                  <Route path=":discountId/edit" element={<DiscountEdit />} />
                </Route>

                {/* Coming Soon */}
                <Route
                  path="/analytic"
                  element={<Navigate to="/coming-soon" replace />}
                />
                <Route
                  path="/return"
                  element={<Navigate to="/coming-soon" replace />}
                />
                <Route
                  path="/inventory"
                  element={<Navigate to="/coming-soon" replace />}
                />
                <Route
                  path="/customer"
                  element={<Navigate to="/coming-soon" replace />}
                />
                <Route
                  path="/segment"
                  element={<Navigate to="/coming-soon" replace />}
                />
                <Route
                  path="/setting"
                  element={<Navigate to="/coming-soon" replace />}
                />
                <Route
                  path="/user-management"
                  element={<Navigate to="/coming-soon" replace />}
                />
                <Route
                  path="/notification"
                  element={<Navigate to="/coming-soon" replace />}
                />
                <Route
                  path="/report"
                  element={<Navigate to="/coming-soon" replace />}
                />
                <Route path="/coming-soon" element={<ComingSoon />} />

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
