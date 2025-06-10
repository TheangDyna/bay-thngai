import {
  ArrowRightLeft,
  Bell,
  Box,
  Boxes,
  ChartPie,
  Gauge,
  History,
  Inbox,
  LogOut,
  MessageSquareWarning,
  Percent,
  Puzzle,
  Settings2,
  Undo2,
  User,
  Users
} from "lucide-react";

type MenuSection = {
  title: string;
  subItems: MenuItem[];
};

type MenuItem = {
  title: string;
  icon: React.ComponentType;
  path: string;
  disabled?: boolean;
};

export const menuItems: MenuSection[] = [
  {
    title: "Dashboard",
    subItems: [
      {
        title: "Overview",
        icon: Gauge,
        path: "/dashboard"
      },
      {
        title: "Analytics",
        icon: ChartPie,
        path: "#"
      }
    ]
  },
  {
    title: "Products",
    subItems: [
      {
        title: "Products List",
        icon: Box,
        path: "/products"
      },
      {
        title: "Create Product",
        icon: Box,
        path: "/products/new"
      },
      {
        title: "Detail Product",
        path: "/products/:id",
        icon: Box,
        disabled: true
      },
      {
        title: "Edit Product",
        path: "/products/:id/edit",
        icon: Box,
        disabled: true
      }
    ]
  },
  {
    title: "Cuisines",
    subItems: [
      {
        title: "Cuisines List",
        icon: Boxes,
        path: "/cuisines"
      },
      {
        title: "Create Cuisine",
        icon: Boxes,
        path: "/cuisines/new"
      },
      {
        title: "Edit Cuisine",
        path: "/cuisines/:id/edit",
        icon: Boxes,
        disabled: true
      }
    ]
  },
  {
    title: "Inventory",
    subItems: [
      {
        title: "Inventory",
        icon: Inbox,
        path: "#"
      }
    ]
  },
  {
    title: "Orders",
    subItems: [
      {
        title: "All Orders",
        icon: ArrowRightLeft,
        path: "#"
      },
      {
        title: "Returns",
        icon: Undo2,
        path: "#"
      }
    ]
  },
  {
    title: "Customers",
    subItems: [
      {
        title: "All Customers",
        icon: User,
        path: "#"
      },
      {
        title: "Segments",
        icon: History,
        path: "#"
      }
    ]
  },
  {
    title: "Promotions",
    subItems: [
      {
        title: "Discounts",
        icon: Percent,
        path: "#"
      },
      {
        title: "Coupons",
        icon: Puzzle,
        path: "#"
      }
    ]
  },
  {
    title: "Settings",
    subItems: [
      {
        title: "Store Settings",
        icon: Settings2,
        path: "#"
      },
      {
        title: "User Management",
        icon: Users,
        path: "#"
      },
      {
        title: "Notifications",
        icon: Bell,
        path: "#"
      }
    ]
  },
  {
    title: "Reports",
    subItems: [
      {
        title: "Reports",
        icon: MessageSquareWarning,
        path: "#"
      }
    ]
  },
  {
    title: "Logout",
    subItems: [
      {
        title: "Logout",
        icon: LogOut,
        path: "#"
      }
    ]
  }
];
