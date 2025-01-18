import {
  Gauge,
  ChartPie,
  Boxes,
  Box,
  Users,
  Inbox,
  Undo2,
  ArrowRightLeft,
  History,
  Settings2,
  Bell,
  MessageSquareWarning,
  LogOut,
  Percent,
  Puzzle,
  User
} from "lucide-react";

type MenuSection = {
  title: string;
  subItems: MenuItem[];
};

type MenuItem = {
  title: string;
  path: string;
  disabled?: boolean;
};

export const menuItems: MenuSection[] = [
  {
    title: "Dashboard",
    subItems: [
      {
        title: "Overview",
        path: "/dashboard"
      },
      {
        title: "Analytics",
        path: "/analytics"
      }
    ]
  },
  {
    title: "Products",
    subItems: [
      {
        title: "Products List",
        path: "/products"
      },
      {
        title: "Create Product",
        path: "/products/new"
      },
      {
        title: "Detail Product",
        path: "/products/:id",
        disabled: true
      },
      {
        title: "Edit Product",
        path: "/products/:id/edit",
        disabled: true
      }
    ]
  },
  {
    title: "Cuisines",
    subItems: [
      {
        title: "Cuisines List",
        path: "#"
      },
      {
        title: "Create Cuisine",
        path: "/cuisines/new"
      }
    ]
  },
  {
    title: "Inventory",
    subItems: [
      {
        title: "Inventory",
        path: "#"
      }
    ]
  },
  {
    title: "Orders",
    subItems: [
      {
        title: "All Orders",
        path: "#"
      },
      {
        title: "Returns",
        path: "#"
      }
    ]
  },
  {
    title: "Customers",
    subItems: [
      {
        title: "All Customers",
        path: "#"
      },
      {
        title: "Segments",
        path: "#"
      }
    ]
  },
  {
    title: "Promotions",
    subItems: [
      {
        title: "Discounts",
        path: "#"
      },
      {
        title: "Coupons",
        path: "#"
      }
    ]
  },
  {
    title: "Settings",
    subItems: [
      {
        title: "Store Settings",

        path: "#"
      },
      {
        title: "User Management",
        path: "#"
      },
      {
        title: "Notifications",
        path: "#"
      }
    ]
  },
  {
    title: "Reports",
    subItems: [
      {
        title: "Reports",
        path: "#"
      }
    ]
  },
  {
    title: "Logout",
    subItems: [
      {
        title: "Logout",
        path: "#"
      }
    ]
  }
];
