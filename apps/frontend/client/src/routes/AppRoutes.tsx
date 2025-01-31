import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "@/pages/Home";
import BaseLayout from "@/components/layouts/BaseLayout";
import NotFound from "@/pages/NotFound";
import Search from "@/pages/Search";
import Shop from "@/pages/Shop";
import ShopProductDetailSlug from "@/pages/shops/[shopProductDetailSlug]";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <BaseLayout>
              <Outlet />
            </BaseLayout>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/shops" element={<Shop />} />
          <Route path="/shops/:slug" element={<ShopProductDetailSlug />} />
        </Route>
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
