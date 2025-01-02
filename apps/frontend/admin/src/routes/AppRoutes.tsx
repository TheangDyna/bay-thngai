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
import Dashboard from "@/pages/Dashboard";
import ProductList from "@/pages/products/ProductList";
import ProductCreate from "@/pages/products/ProductCreate";
import { Toaster } from "@/components/ui/toaster";
import CategoryCreate from "@/pages/categories/CategoryCreate";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

const AppRoutes: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate replace to="/dashboard" />} />

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
                <Route path=":productId" element={<div>Product Detail</div>} />
                <Route path="new" element={<ProductCreate />} />
                <Route
                  path=":productId/edit"
                  element={<div>Product Edit</div>}
                />
              </Route>

              {/* Categories Route */}
              <Route path="categories" element={<Outlet />}>
                <Route index element={<div>Category List</div>} />
                <Route
                  path=":categoryId"
                  element={<div>Category Detail</div>}
                />
                <Route path="new" element={<CategoryCreate />} />
                <Route
                  path=":categoryId/edit"
                  element={<div>Category Edit</div>}
                />
              </Route>
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppRoutes;
