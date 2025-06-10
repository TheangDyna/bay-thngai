import { UserNav } from "@/components/commons/UserNav";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"; // ShadCN NavigationMenu
import Cart from "@/pages/Cart";
import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Define categories and dietary options outside the component
const categories = [
  { name: "Fresh Vegetable", path: "/categories/fresh-vegetable" },
  { name: "Diet Nutrition", path: "/categories/diet-nutrition" },
  { name: "Healthy Food", path: "/categories/healthy-food" },
  { name: "Organic Food", path: "/categories/organic-food" }
];

const dietary = [
  { name: "Vegan", path: "/dietary/vegan" },
  { name: "Gluten-Free", path: "/dietary/gluten-free" },
  { name: "Keto", path: "/dietary/keto" }
];

export const NavigationBar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState<boolean>(false);

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
      className={
        "sticky top-0 z-50 h-20 flex items-center justify-between w-full px-6 py-4 bg-background transition-shadow border-b"
      }
    >
      {/* Left */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="flex items-center">
          <img
            src="/bay-thngai-logo.svg"
            alt="Bay Thngai logo"
            className="w-12 h-12"
          />
        </Link>

        {/* Navigation Links */}
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-2">
            {/* Categories */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-sm font-medium",
                  isActive("/categories")
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                )}
              >
                Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-4 md:w-[300px] md:grid-cols-2 lg:w-[400px]">
                  {categories.map((item) => (
                    <li key={item.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            "block select-none rounded-md p-2 text-sm font-medium leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive(item.path)
                              ? "text-primary font-semibold"
                              : "text-muted-foreground"
                          )}
                        >
                          {item.name}
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
                  navigationMenuTriggerStyle(),
                  "text-sm font-medium",
                  isActive("/dietary")
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                )}
              >
                Dietary
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-4 md:w-[300px] md:grid-cols-2 lg:w-[400px]">
                  {dietary.map((item) => (
                    <li key={item.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            "block select-none rounded-md p-2 text-sm font-medium leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            isActive(item.path)
                              ? "text-primary font-semibold"
                              : "text-muted-foreground"
                          )}
                        >
                          {item.name}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Search and Shop */}
            {[
              { to: "/search", label: "Search" },
              { to: "/shops", label: "Shop" }
            ].map((link) => (
              <NavigationMenuItem key={link.to}>
                <NavigationMenuLink asChild>
                  <Link
                    to={link.to}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm font-medium",
                      isActive(link.to)
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
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

      {/* Right */}
      <div className="flex items-center space-x-6">
        <Cart />
        <UserNav />
      </div>
    </nav>
  );
};
