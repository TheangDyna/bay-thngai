import { ScrollToTop } from "@/components/commons/ScrollToTop";
import BaseLayout from "@/components/layouts/BaseLayout";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth.context";
import { CartProvider } from "@/contexts/cart.context";
import { ThemeProvider } from "@/contexts/theme.context";

import CheckoutPage from "@/pages/checkout/CheckoutPage";
import CheckoutTestPage from "@/pages/checkout/CheckoutTestPage";
import Home from "@/pages/Home";
import Loading from "@/pages/Loading";
import NotFound from "@/pages/NotFound";
import OrderTrackingPage from "@/pages/order/order-track";
import PaymentCancel from "@/pages/payment/payment-cancel";
import PaymentReturn from "@/pages/payment/payment-return";
import ProductDetailPage from "@/pages/product/ProductDetailPage";
import AddressSettingsPage from "@/pages/profile/address/AddressSettingsPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import Search from "@/pages/search/SearchPage";
import Shop from "@/pages/Shop";

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
                <ScrollToTop />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <BaseLayout>
                        <Outlet />
                      </BaseLayout>
                    }
                  >
                    <Route index element={<Home />} />
                    <Route path="search" element={<Search />} />
                    <Route
                      path="product/:productId"
                      element={<ProductDetailPage />}
                    />
                    <Route path="shops" element={<Shop />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route
                      path="checkout-test"
                      element={<CheckoutTestPage />}
                    />
                    <Route path="payment-cancel" element={<PaymentCancel />} />
                    <Route path="payment-return" element={<PaymentReturn />} />
                    <Route
                      path="order-track/:tranId"
                      element={<OrderTrackingPage />}
                    />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="address" element={<AddressSettingsPage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </CartProvider>
        <Toaster />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppRoutes;
