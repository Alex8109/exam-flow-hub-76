import { 
  Home, 
  BookOpen, 
  FileText, 
  Users, 
  Settings, 
  Trophy,
  Upload,
  BarChart3
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const getNavCls = ({ isActive }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent";

  // Different navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { title: "Dashboard", url: "/dashboard", icon: Home },
    ];

    if (user?.role === 'student') {
      return [
        ...baseItems,
        { title: "Available Exams", url: "/exams", icon: BookOpen },
        { title: "My Results", url: "/results", icon: Trophy },
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { title: "Create Exam", url: "/create-exam", icon: FileText },
        { title: "Upload Questions", url: "/upload-csv", icon: Upload },
        { title: "Manage Exams", url: "/manage-exams", icon: Settings },
        { title: "Results", url: "/exam-results", icon: BarChart3 },
      ];
    }

    if (user?.role === 'super_admin') {
      return [
        ...baseItems,
        { title: "User Management", url: "/users", icon: Users },
        { title: "All Exams", url: "/all-exams", icon: BookOpen },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
        { title: "System Settings", url: "/settings", icon: Settings },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="bg-white/50 backdrop-blur-sm border-r border-border">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => 
                        `${getNavCls({ isActive })} flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive ? 'shadow-md' : ''
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}