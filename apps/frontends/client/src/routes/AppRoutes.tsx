import ProtectedRoute from "@/components/commons/ProtectedRoute";
import BaseLayout from "@/components/layouts/BaseLayout";
import { AuthProvider } from "@/contexts/auth.context";
import { CartProvider } from "@/contexts/cart.context";
import { ThemeProvider } from "@/contexts/theme.context";
import CheckoutPage from "@/pages/checkout/CheckoutPage";
import CheckoutTestPage from "@/pages/checkout/CheckoutTestPage";
import PaymentCancel from "@/pages/checkout/PaymentCancel";
import Home from "@/pages/Home";
import Loading from "@/pages/Loading";
import NotFound from "@/pages/NotFound";
import AddressSettingsPage from "@/pages/profile/address/AddressSettingsPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import Search from "@/pages/search/Search";
import Shop from "@/pages/Shop";
import ShopProductDetailSlug from "@/pages/shops/[ShopProductDetailSlug]";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

const queryClient = new QueryClient();

const AppRoutes: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <CartProvider>
          <AuthProvider>
            <BrowserRouter>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <BaseLayout>
                          <Outlet />
                        </BaseLayout>
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/shops" element={<Shop />} />
                    <Route
                      path="/shops/:slug"
                      element={<ShopProductDetailSlug />}
                    />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route
                      path="/checkout-test"
                      element={<CheckoutTestPage />}
                    />
                    <Route path="/payment-cancel" element={<PaymentCancel />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/address" element={<AddressSettingsPage />} />
                  </Route>
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </CartProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppRoutes;
