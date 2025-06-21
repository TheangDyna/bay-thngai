import { ScrollToTop } from "@/components/commons/ScrollToTop";
import BaseLayout from "@/components/layouts/BaseLayout";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth.context";
import { CartProvider } from "@/contexts/cart.context";
import { ThemeProvider } from "@/contexts/theme.context";
import Loading from "@/pages/Loading";
import CheckoutPage from "@/pages/checkout/CheckoutPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy, Suspense } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

// Lazy-loaded components
const Home = lazy(async () => await import("@/pages/home/Home"));
const NotFound = lazy(async () => await import("@/pages/NotFound"));
const OrderTrackingPage = lazy(
  async () => await import("@/pages/order/order-track")
);
const PaymentCancel = lazy(
  async () => await import("@/pages/payment/payment-cancel")
);
const PaymentReturn = lazy(
  async () => await import("@/pages/payment/payment-return")
);
const ProductDetailPage = lazy(
  async () => await import("@/pages/product/ProductDetailPage")
);
const ProfilePage = lazy(
  async () => await import("@/pages/profile/ProfilePage")
);
const Search = lazy(async () => await import("@/pages/search/SearchPage"));
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
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="payment-cancel" element={<PaymentCancel />} />
                    <Route path="payment-return" element={<PaymentReturn />} />
                    <Route
                      path="order-track/:tranId"
                      element={<OrderTrackingPage />}
                    />
                    <Route path="profile" element={<ProfilePage />} />
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
