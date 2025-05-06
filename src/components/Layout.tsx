
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { 
  LogOut, LayoutDashboard, Users, Package, Settings, 
  Ruler, User
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarHeader,
} from "./ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { signOut, profile } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();

  const mainNavItems = [
    { path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { path: "/orders", icon: <Package className="w-5 h-5" />, label: "Orders" },
    { path: "/customers", icon: <Users className="w-5 h-5" />, label: "Customers" },
    { path: "/inventory", icon: <Package className="w-5 h-5" />, label: "Inventory" },
    { path: "/measurements", icon: <Ruler className="w-5 h-5" />, label: "Measurements" },
    { path: "/settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/") return true;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen w-full flex">
        {/* Desktop Sidebar */}
        <Sidebar>
          <SidebarContent className="flex flex-col h-full bg-[hsl(var(--silai-sidebar))] border-r border-gray-200">
            <SidebarHeader className="p-4 mb-2">
              <Link to="/" className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-800">
                  Silai Sahayak
                </h1>
              </Link>
            </SidebarHeader>
            
            <div className="flex-1">
              <SidebarMenu>
                {mainNavItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.label}
                        isActive={active}
                        className={cn(
                          "w-full transition-colors",
                          active ? 'text-primary font-medium' : 'text-gray-600'
                        )}
                      >
                        <Link to={item.path} className="flex items-center gap-4 px-3 py-2 w-full">
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>

            <SidebarFooter>
              <SidebarSeparator className="my-2" />
              <div className="p-4">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-gray-100"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4 mr-4" />
                  Log out
                </Button>
              </div>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col overflow-auto bg-[hsl(var(--silai-main))]">
          {/* Mobile Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center md:hidden">
            <SidebarTrigger className="mr-2 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </SidebarTrigger>
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-lg font-bold text-gray-800">
                Silai Sahayak
              </h1>
            </div>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
              {profile?.full_name ? profile.full_name[0].toUpperCase() : <User className="w-4 h-4" />}
            </Link>
          </div>
          
          <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
            {children}
          </main>
          
          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center z-10">
            {mainNavItems.slice(0, 4).map((item) => {
              const active = isActive(item.path);
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex flex-col items-center py-3 px-2 flex-1 ${
                    active ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {item.icon}
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
