// src/pages/ProfilePage.tsx
import { AccountSettings } from "@/pages/profile/AccountSettings";
import { AddressSettings } from "@/pages/profile/AddressSettings";
import { ContactSettings } from "@/pages/profile/ContactSettings";
import { Orders } from "@/pages/profile/Orders";
import { Sidebar, Tab } from "@/pages/profile/Sidebar";
import { Wishlists } from "@/pages/profile/Wishlists";
import React from "react";
import { useSearchParams } from "react-router-dom";

const VALID_TABS: Tab[] = [
  "account",
  "addresses",
  "contacts",
  "orders",
  "wishlist"
];

const ProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramTab = searchParams.get("tab") as Tab | null;
  const activeTab: Tab =
    paramTab && VALID_TABS.includes(paramTab) ? paramTab : "account";

  const handleTabChange = (tab: Tab) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    setSearchParams(next);
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <main className="flex-1 p-8">
        {activeTab === "account" && <AccountSettings />}
        {activeTab === "addresses" && <AddressSettings />}
        {activeTab === "contacts" && <ContactSettings />}
        {activeTab === "orders" && <Orders />}
        {activeTab === "wishlist" && <Wishlists />}
      </main>
    </div>
  );
};

export default ProfilePage;
