// src/components/profile/Sidebar.tsx
import {
  HeartIcon,
  LogOutIcon,
  MapIcon,
  PhoneIcon,
  ShoppingBagIcon,
  UserIcon
} from "lucide-react";
import React from "react";

export type Tab = "account" | "addresses" | "contacts" | "orders" | "wishlist";

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab
}) => {
  const items: Array<{ tab: Tab; label: string; Icon: React.ElementType }> = [
    { tab: "account", label: "Account Settings", Icon: UserIcon },
    { tab: "orders", label: "Orders", Icon: ShoppingBagIcon },
    { tab: "wishlist", label: "Wishlist", Icon: HeartIcon },
    { tab: "addresses", label: "Address", Icon: MapIcon },
    { tab: "contacts", label: "Contacts", Icon: PhoneIcon }
  ];

  return (
    <aside className="w-[300px] h-[calc(100vh-64px)] sticky top-16 bg-background border-r">
      <nav className="mt-4">
        <ul className="space-y-1">
          {items.map(({ tab, label, Icon }) => (
            <li key={tab}>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-r-lg ${
                  activeTab === tab
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{label}</span>
              </button>
            </li>
          ))}
          <li>
            <button className="flex items-center w-full px-4 py-3 rounded-r-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              <LogOutIcon className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
