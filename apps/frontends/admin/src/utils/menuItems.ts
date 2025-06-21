import {
  ArrowRightLeft,
  Bell,
  Box,
  Boxes,
  ChartPie,
  CirclePlus,
  Gauge,
  History,
  Inbox,
  LogOut,
  MessageSquareWarning,
  Pencil,
  Percent,
  ScanSearch,
  Settings2,
  Undo2,
  User,
  Users,
  Wand
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
        path: "/analytic"
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
        icon: CirclePlus,
        path: "/products/new"
      },
      {
        title: "Detail Product",
        path: "/products/:id",
        icon: ScanSearch,
        disabled: true
      },
      {
        title: "Edit Product",
        path: "/products/:id/edit",
        icon: Pencil,
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
        icon: CirclePlus,
        path: "/cuisines/new"
      },
      {
        title: "Edit Cuisine",
        path: "/cuisines/:id/edit",
        icon: Pencil,
        disabled: true
      }
    ]
  },
  {
    title: "Orders",
    subItems: [
      {
        title: "All Orders",
        icon: ArrowRightLeft,
        path: "/order"
      },
      {
        title: "Returns",
        icon: Undo2,
        path: "/return"
      }
    ]
  },
  {
    title: "Promotions",
    subItems: [
      {
        title: "Discounts List",
        icon: Percent,
        path: "/discount"
      },
      {
        title: "Create Discount",
        icon: CirclePlus,
        path: "/discount/new"
      },
      {
        title: "Edit Discount",
        path: "/discount/:id/edit",
        icon: Pencil,
        disabled: true
      },
      {
        title: "Apply Discount",
        path: "/discount/apply",
        icon: Wand
      }
    ]
  },
  {
    title: "Inventory",
    subItems: [
      {
        title: "Inventory",
        icon: Inbox,
        path: "/inventory"
      }
    ]
  },
  {
    title: "Customers",
    subItems: [
      {
        title: "All Customers",
        icon: User,
        path: "/customer"
      },
      {
        title: "Segments",
        icon: History,
        path: "/segment"
      }
    ]
  },

  {
    title: "Settings",
    subItems: [
      {
        title: "Store Settings",
        icon: Settings2,
        path: "/setting"
      },
      {
        title: "User Management",
        icon: Users,
        path: "/user-management"
      },
      {
        title: "Notifications",
        icon: Bell,
        path: "/notification"
      }
    ]
  },
  {
    title: "Reports",
    subItems: [
      {
        title: "Reports",
        icon: MessageSquareWarning,
        path: "/report"
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
