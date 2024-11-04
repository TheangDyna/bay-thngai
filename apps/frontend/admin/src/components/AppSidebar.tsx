import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { menuItems } from "@/libs/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";

export const AppSidebar: React.FC = () => {
  const location = useLocation();
  return (
    <Sidebar>
      <ScrollArea>
        <SidebarContent>
          {menuItems.map((item, index) => {
            return (
              <SidebarGroup key={index}>
                <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.subItems.map((subItem, index) => {
                      const isActive = location.pathname === subItem.url;
                      return (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <a href={subItem.url}>
                              <subItem.icon />
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
};
