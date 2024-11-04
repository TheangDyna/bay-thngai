import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ThemeProvider } from "@/contexts/theme/ThemeContext";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import ProtectedRoute from "@/contexts/auth/ProtectedRoute";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import ProductList from "@/pages/ProductList";
import ProductCreate from "@/pages/ProductCreate";
import { Toaster } from "@/components/ui/toaster";

const AppRoutes: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard Routes */}
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
              <Route path="dashboard" element={<Dashboard />} />

              {/* products Route */}
              <Route path="products" element={<Outlet />}>
                <Route index element={<ProductList />} />
                <Route path=":productId" element={<div>Product Detail</div>} />
                <Route path="new" element={<ProductCreate />} />
                <Route
                  path=":productId/edit"
                  element={<div>Product Edit</div>}
                />
              </Route>
            </Route>

            {/* 404 Route */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
};

export default AppRoutes;
