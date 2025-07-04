import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import { Toaster } from "../ui/toaster";
import NavigationBarSearch from "./NavigationBarSearch";
import { useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

interface LayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation(); // Hook to get the current route

  // Mapping of route paths to human-readable names
  const routeMap: { [key: string]: string } = {
    search: "Search",
    shop: "Shop"
  };

  // Show NavigationBarSearch for both `/shop` and `/search` pages
  const isShowSearchNavigatorBar = () => {
    if (
      location.pathname === "/search" ||
      location.pathname === "/shops" ||
      location.pathname.startsWith("/shops/") ||
      location.pathname.startsWith("/search/")
    ) {
      return <NavigationBarSearch />;
    } else {
      return <NavigationBar />;
    }
  };

  // Function to generate dynamic breadcrumbs
  const generateBreadcrumbs = () => {
    if (location.pathname === "/") {
      return null; // Don't show breadcrumbs on the home page
    }

    const paths = location.pathname.split("/").filter((path) => path);
    const breadcrumbs = paths.map((path, index) => {
      const fullPath = `/${paths.slice(0, index + 1).join("/")}`;
      const isLast = index === paths.length - 1; // Check if it's the last breadcrumb

      return (
        <BreadcrumbItem key={index} aria-current={isLast ? "page" : undefined}>
          <BreadcrumbLink
            className={`${
              isLast
                ? "text-primary font-bold capitalize text-md" // Active breadcrumb style
                : "hover:text-primary capitalize text-md"
            }`}
            href={isLast ? "#" : fullPath} // Prevent navigating to the last breadcrumb
          >
            {routeMap[path] || path.replace("-", " ")}{" "}
            {/* Use routeMap for readable names, fallback to path */}
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
    });

    return (
      <Breadcrumb className="text-md">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="hover:text-secondary capitalize"
              href="/"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {breadcrumbs}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50">
        {isShowSearchNavigatorBar()}
      </header>

      {/* Main Content */}
      <main className="flex-grow relative">
        {/* Breadcrumbs */}
        <div
          className={`${
            location.pathname !== "/"
              ? "py-8 px-8 bg-white border-b text-md"
              : ""
          }`}
        >
          {generateBreadcrumbs()}
        </div>
        {children}
        <Toaster />
      </main>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default BaseLayout;
