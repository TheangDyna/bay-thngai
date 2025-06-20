import { Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { UserNav } from "@/components/commons/UserNav";
import Cart from "@/components/layouts/Cart";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/utils/cn";
import { Link, useLocation } from "react-router-dom";

// Define categories and dietary options
const categories = [
  {
    name: "Fresh Vegetable",
    path: "#",
    description: "Farm-fresh vegetables delivered daily"
  },
  {
    name: "Diet Nutrition",
    path: "#",
    description: "Nutritious options for healthy living"
  },
  {
    name: "Healthy Food",
    path: "#",
    description: "Wholesome meals and ingredients"
  },
  {
    name: "Organic Food",
    path: "#",
    description: "Certified organic products"
  }
];

const dietary = [
  { name: "Vegan", path: "#", description: "Plant-based options" },
  {
    name: "Gluten-Free",
    path: "#",
    description: "Safe for celiac and gluten sensitivity"
  },
  {
    name: "Keto",
    path: "#",
    description: "Low-carb, high-fat diet options"
  }
];

const navigationLinks = [{ to: "/search", label: "Search" }];

export function NavigationBar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if the current path matches or starts with the link path
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 h-16 flex items-center justify-between w-full px-4 md:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 border-b",
        scrolled && "shadow-sm"
      )}
    >
      {/* Mobile Menu Button */}
      <div className="flex items-center lg:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-4">
              <Link
                to="/"
                className="flex items-center space-x-2 pb-4 border-b"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img
                  src="/bay-thngai-logo.svg"
                  alt="Bay Thngai logo"
                  className="w-16 h-16"
                />
              </Link>

              {/* Mobile Categories */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Categories
                </h3>
                {categories.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive(item.path)
                        ? "text-primary font-semibold bg-accent"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Dietary */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Dietary
                </h3>
                {dietary.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive(item.path)
                        ? "text-primary font-semibold bg-accent"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-2 pt-4 border-t">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive(link.to)
                        ? "text-primary font-semibold bg-accent"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/bay-thngai-logo.svg"
            alt="Bay Thngai logo"
            className="w-16 h-16"
          />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center flex-1 justify-center">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-1">
            {/* Categories */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive("/categories")
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {categories.map((item) => (
                    <li key={item.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive(item.path) &&
                              "bg-accent text-accent-foreground"
                          )}
                        >
                          <div
                            className={cn(
                              "text-sm font-medium leading-none",
                              isActive(item.path)
                                ? "text-primary font-semibold"
                                : ""
                            )}
                          >
                            {item.name}
                          </div>
                          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Dietary */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive("/dietary")
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Dietary
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[500px]">
                  {dietary.map((item) => (
                    <li key={item.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive(item.path) &&
                              "bg-accent text-accent-foreground"
                          )}
                        >
                          <div
                            className={cn(
                              "text-sm font-medium leading-none",
                              isActive(item.path)
                                ? "text-primary font-semibold"
                                : ""
                            )}
                          >
                            {item.name}
                          </div>
                          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Search and Shop */}
            {navigationLinks.map((link) => (
              <NavigationMenuItem key={link.to}>
                <NavigationMenuLink asChild>
                  <Link
                    to={link.to}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm font-medium transition-colors",
                      isActive(link.to)
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2">
        {/* Mobile Search Button */}
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>

        <Cart />
        <UserNav />
      </div>
    </nav>
  );
}
