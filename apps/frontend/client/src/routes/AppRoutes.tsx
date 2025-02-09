import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Home from "@/pages/Home";
import BaseLayout from "@/components/layouts/BaseLayout";
import NotFound from "@/pages/NotFound";
import Search from "@/pages/Search";
import Shop from "@/pages/Shop";
import ShopProductDetailSlug from "@/pages/shops/[ShopProductDetailSlug]";
import { ThemeProvider } from "@/contexts/theme/ThemeContext";
import { Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loading from "@/pages/Loading";

const queryClient = new QueryClient();

const AppRoutes: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
              </Route>
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppRoutes;
