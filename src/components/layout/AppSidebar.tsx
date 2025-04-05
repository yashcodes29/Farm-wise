
import { Calendar, Home, LineChart, Leaf, MessageSquare, ShoppingCart, Sprout } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

// Navigation items for the sidebar
const navItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    title: "Weather",
    icon: Calendar,
    path: "/weather",
  },
  {
    title: "Crop Health",
    icon: Sprout,
    path: "/crop-health",
  },
  {
    title: "Resource Management",
    icon: Leaf,
    path: "/resources",
  },
  {
    title: "Market Prices",
    icon: ShoppingCart,
    path: "/market",
  },
  {
    title: "Community",
    icon: MessageSquare,
    path: "/community",
  },
  {
    title: "Analytics",
    icon: LineChart,
    path: "/analytics",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6" />
          <span className="font-bold text-lg">FarmWise</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-center">
        <p>FarmWise Intelligence Platform</p>
        <p className="mt-1">©2025 Smart Farming Solutions</p>
      </SidebarFooter>
    </Sidebar>
  );
}
