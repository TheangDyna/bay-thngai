import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/contexts/theme/ModeToggle";
import React from "react";
import { Search } from "@/components/Search";
import { UserNav } from "@/components/UserNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children
}) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <div className="border-b">
          <div className="flex h-16 items-center px-4 gap-x-4">
            <SidebarTrigger />
            <Search />
            <div className="ml-auto flex items-center gap-x-4">
              <UserNav />
              <ModeToggle />
            </div>
          </div>
        </div>
        <main className="p-5">{children}</main>
      </div>
    </SidebarProvider>
  );
};
