// src/pages/ProfilePage.tsx
import { AccountSettings } from "@/pages/profile/AccountSettings";
import { AddressSettings } from "@/pages/profile/AddressSettings";
import { ContactSettings } from "@/pages/profile/ContactSettings";
import { Sidebar, Tab } from "@/pages/profile/Sidebar";
import React, { useState } from "react";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("account");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8">
        {activeTab === "account" && <AccountSettings />}
        {activeTab === "addresses" && <AddressSettings />}
        {activeTab === "contacts" && <ContactSettings />}
        {/* add more tabs here */}
      </main>
    </div>
  );
};

export default ProfilePage;
