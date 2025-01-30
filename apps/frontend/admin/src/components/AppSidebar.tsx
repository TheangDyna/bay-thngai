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
import { menuItems } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, Link, matchPath } from "react-router-dom";

export const AppSidebar: React.FC = () => {
  const location = useLocation();
  const isActivePath = (subItemPath: string, currentPath: string) => {
    if (currentPath.includes("/new") && subItemPath.includes(":")) {
      return false;
    }
    return !!matchPath(subItemPath, currentPath);
  };

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
                      const isActive = isActivePath(
                        subItem.path,
                        location.pathname
                      );
                      return (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            {!isActive && subItem.disabled ? (
                              <span className="opacity-50" aria-disabled="true">
                                <subItem.icon />
                                {subItem.title}
                              </span>
                            ) : (
                              <Link
                                to={subItem.path}
                                className={
                                  isActive
                                    ? "pointer-events-none"
                                    : "pointer-events-auto"
                                }
                              >
                                <subItem.icon />
                                <span>{subItem.title}</span>
                              </Link>
                            )}
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
