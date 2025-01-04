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
import Login from "@/pages/auths/Login";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/dashboards/Dashboard";
import ProductList from "@/pages/products/ProductList";
import ProductCreate from "@/pages/products/ProductCreate";
import { Toaster } from "@/components/ui/toaster";
import CuisineCreate from "@/pages/cuisines/CuisineCreate";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();

const AppRoutes: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
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
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />

              {/* Products Route */}
              <Route path="products" element={<Outlet />}>
                <Route index element={<ProductList />} />
                <Route path=":productId" element={<div>Product Detail</div>} />
                <Route path="new" element={<ProductCreate />} />
                <Route
                  path=":productId/edit"
                  element={<div>Product Edit</div>}
                />
              </Route>

              {/* Cuisines Route */}
              <Route path="cuisines" element={<Outlet />}>
                <Route index element={<div>Cuisine List</div>} />
                <Route path=":cuisineId" element={<div>Cuisine Detail</div>} />
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
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppRoutes;
