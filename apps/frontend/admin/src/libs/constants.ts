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

type MenuItem = {
  title: string;
  icon: React.ComponentType;
  url: string;
};

type MenuSection = {
  title: string;
  subItems: MenuItem[];
};

export const menuItems: MenuSection[] = [
  {
    title: "Dashboard",
    subItems: [
      {
        title: "Overview",
        icon: Gauge,
        url: "/dashboard"
      },
      {
        title: "Analytics",
        icon: ChartPie,
        url: "/analytics"
      }
    ]
  },
  {
    title: "Products",
    subItems: [
      {
        title: "All Products",
        icon: Box,
        url: "/list-products"
      },
      {
        title: "Categories",
        icon: Boxes,
        url: "#"
      },
      {
        title: "Inventory",
        icon: Inbox,
        url: "#"
      }
    ]
  },
  {
    title: "Orders",
    subItems: [
      {
        title: "All Orders",
        icon: ArrowRightLeft,
        url: "#"
      },
      {
        title: "Returns",
        icon: Undo2,
        url: "#"
      }
    ]
  },
  {
    title: "Customers",
    subItems: [
      {
        title: "All Customers",
        icon: User,
        url: "#"
      },
      {
        title: "Segments",
        icon: History,
        url: "#"
      }
    ]
  },
  {
    title: "Promotions",
    subItems: [
      {
        title: "Discounts",
        icon: Percent,
        url: "#"
      },
      {
        title: "Coupons",
        icon: Puzzle,
        url: "#"
      }
    ]
  },
  {
    title: "Settings",
    subItems: [
      {
        title: "Store Settings",
        icon: Settings2,
        url: "#"
      },
      {
        title: "User Management",
        icon: Users,
        url: "#"
      },
      {
        title: "Notifications",
        icon: Bell,
        url: "#"
      }
    ]
  },
  {
    title: "Reports",
    subItems: [
      {
        title: "Reports",
        icon: MessageSquareWarning,
        url: "#"
      }
    ]
  },
  {
    title: "Logout",
    subItems: [
      {
        title: "Logout",
        icon: LogOut,
        url: "#"
      }
    ]
  }
];
