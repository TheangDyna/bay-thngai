import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "@/pages/Home";
import BaseLayout from "@/components/layouts/BaseLayout";
import NotFound from "@/pages/NotFound";
import Search from "@/pages/Search";
import Shop from "@/pages/Shop";

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
          <Route path="/shop" element={<Shop />} />
        </Route>
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
