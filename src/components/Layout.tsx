
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { 
  LogOut, LayoutDashboard, Users, Package, Settings, UserRound,
  Menu, PlusSquare, Sparkles, PackageOpen
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
    { path: "/orders/new", icon: <PlusSquare className="w-5 h-5" />, label: "New Order" },
    { path: "/inventory", icon: <PackageOpen className="w-5 h-5" />, label: "Inventory" },
    { path: "/customers", icon: <Users className="w-5 h-5" />, label: "Customer List" },
    { path: "/profile", icon: <UserRound className="w-5 h-5" />, label: "My Profile" },
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
          <SidebarContent className="flex flex-col h-full bg-[hsl(var(--silai-sidebar))]">
            <SidebarHeader className="p-4 mb-2 border-b border-gray-800">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-green-400">
                  Silai Sahayak
                </h1>
              </Link>
            </SidebarHeader>
            
            <div className="px-4 py-2 mb-4">
              <p className="text-sm text-gray-400">Welcome,</p>
              <p className="text-sm text-gray-300 truncate font-medium">{profile?.full_name || 'Tailor'}</p>
            </div>
            
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
                          active ? 'bg-gray-800' : ''
                        )}
                      >
                        <Link to={item.path} className="flex items-center gap-4 px-2 py-2 w-full">
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
                  className="w-full justify-start text-gray-300 hover:text-red-400 hover:bg-gray-800"
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
          <div className="bg-[hsl(var(--silai-sidebar))] border-b border-gray-800 p-4 flex items-center md:hidden">
            <SidebarTrigger className="mr-2">
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mr-2">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-green-400">
                Silai Sahayak
              </h1>
            </div>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center">
              {profile?.full_name ? profile.full_name[0].toUpperCase() : <UserRound className="w-4 h-4" />}
            </Link>
          </div>
          
          <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
            {title && <h1 className="text-2xl font-bold mb-6 hidden md:block">{title}</h1>}
            {children}
          </main>
          
          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[hsl(var(--silai-sidebar))] border-t border-gray-800 flex justify-around items-center z-10">
            {mainNavItems.slice(0, 4).map((item) => {
              const active = isActive(item.path);
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex flex-col items-center py-3 px-2 flex-1 ${
                    active ? "text-primary" : "text-gray-400"
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
