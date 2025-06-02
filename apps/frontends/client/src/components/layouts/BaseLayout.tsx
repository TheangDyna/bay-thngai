import NavigationBar from "@/components/layouts/NavigationBar";
import NavigationBarSearch from "@/components/layouts/NavigationBarSearch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";

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
      <header className="sticky top-0 z-50">
        <NavigationBar />
      </header>
      <main className="flex-grow relative">
        {children}
        <Toaster />
      </main>
    </div>
  );
};

export default BaseLayout;
