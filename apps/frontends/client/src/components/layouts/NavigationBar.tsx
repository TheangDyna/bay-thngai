// src/components/NavigationBar.tsx
import { UserNav } from "@/components/commons/UserNav";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import Cart from "@/pages/Cart";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavigationBar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const categories = [
    "Fresh Vegetable",
    "Diet Nutrition",
    "Healthy Food",
    "Organic Food"
  ];
  const dietary = ["Vegan", "Gluten-Free", "Keto"];
  const links = [
    { to: "/search", label: "Search" },
    { to: "/shops", label: "Shop" }
  ];

  return (
    <nav
      className={`
        sticky top-0 z-50 flex items-center justify-between
        w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 2xl:px-10 h-16
        bg-white transition-border
        ${scrolled ? "border-b" : ""}
      `}
    >
      {/* Left */}
      <div className="flex items-center space-x-8">
        <Link to="/">
          <img
            src="/bay-thngai-logo.svg"
            alt="Bay Thngai logo"
            className="w-24 h-24"
          />
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            {/* Categories Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="flex flex-col space-y-1 p-4">
                  {categories.map((item) => (
                    <NavigationMenuLink key={item} asChild>
                      <Link
                        to={`/category/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {item}
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Dietary Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>List</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="#">
                        <div className="font-medium">Components</div>
                        <div className="">
                          Browse all components in the library.
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="#">
                        <div className="font-medium">Documentation</div>
                        <div className="">Learn how to use the library.</div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="#">
                        <div className="font-medium">Blog</div>
                        <div className="">Read our latest blog posts.</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Simple Links */}
            {links.map(({ to, label }) => (
              <NavigationMenuItem key={to}>
                <NavigationMenuLink asChild>
                  <Link
                    to={to}
                    className={`px-2 py-1 rounded-md transition ${
                      isActive(to)
                        ? "bg-gray-200 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-10">
        <div className="flex items-center space-x-2 cursor-pointer text-gray-800 hover:text-black">
          <img
            src="https://flagcdn.com/us.svg"
            alt="US Flag"
            className="w-5 h-5 rounded-sm"
          />
          <span>English - EN</span>
        </div>
        <Cart />
        <UserNav />
      </div>
    </nav>
  );
};

export default NavigationBar;
