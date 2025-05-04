
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { 
  LogOut, Home, Users, ShoppingBag, Palette, Menu, UserRound,
  Ruler, Package, Wallet, Settings, AlertCircle
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
  SidebarGroup,
  SidebarGroupLabel
} from "./ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { signOut, profile } = useAuth();
  const isMobile = useIsMobile();

  const mainNavItems = [
    { path: "/", icon: <Home className="w-5 h-5" />, label: "Home" },
    { path: "/customers", icon: <Users className="w-5 h-5" />, label: "Customers" },
    { path: "/orders", icon: <ShoppingBag className="w-5 h-5" />, label: "Orders" },
    { path: "/designs", icon: <Palette className="w-5 h-5" />, label: "Designs" },
  ];
  
  const comingSoonNavItems = [
    { path: "/measurements", icon: <Ruler className="w-5 h-5" />, label: "Measurements", comingSoon: true },
    { path: "/inventory", icon: <Package className="w-5 h-5" />, label: "Inventory", comingSoon: true },
    { path: "/expenses", icon: <Wallet className="w-5 h-5" />, label: "Expenses", comingSoon: true },
    { path: "/settings", icon: <Settings className="w-5 h-5" />, label: "Settings", comingSoon: true },
  ];

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen w-full flex">
        {/* Desktop Sidebar */}
        <Sidebar>
          <SidebarContent className="flex flex-col h-full">
            <div className="p-4 mb-4">
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.svg" alt="Silai Sahayak Logo" className="w-8 h-8" />
                <h1 className="text-xl font-bold">Silai Sahayak</h1>
              </Link>
            </div>
            
            <div className="flex-1">
              <SidebarGroup>
                <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
                <SidebarMenu>
                  {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.label}
                        isActive={window.location.pathname === item.path}
                      >
                        <Link to={item.path} className="flex items-center gap-2">
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarSeparator className="my-4" />
              
              <SidebarGroup>
                <SidebarGroupLabel>More Features</SidebarGroupLabel>
                <SidebarMenu>
                  {comingSoonNavItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.label}
                        isActive={window.location.pathname === item.path}
                        aria-disabled={item.comingSoon}
                      >
                        <div className="flex items-center gap-2 relative cursor-default">
                          {item.icon}
                          <span>{item.label}</span>
                          {item.comingSoon && (
                            <span className="absolute right-1 top-1 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">Soon</span>
                          )}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </div>

            {/* User profile section */}
            {profile && (
              <SidebarFooter>
                <div className="border-t border-gray-200 pt-4 mt-4 p-4">
                  <Link to="/profile" className="flex items-center mb-3 hover:bg-gray-100 rounded-md p-2 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-silai-600 text-white flex items-center justify-center mr-2">
                      {profile.full_name ? profile.full_name[0] : <UserRound className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{profile.full_name || 'User'}</p>
                      <p className="text-xs text-gray-500">{profile.phone_number}</p>
                    </div>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={signOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </SidebarFooter>
            )}
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Mobile Header */}
          <div className="bg-white border-b p-4 flex items-center md:hidden">
            <SidebarTrigger className="mr-2">
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold">Silai Sahayak</h1>
            </div>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-silai-600 text-white flex items-center justify-center">
              {profile?.full_name ? profile.full_name[0] : <UserRound className="w-4 h-4" />}
            </Link>
          </div>
          
          <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
            {title && <h1 className="text-2xl font-bold mb-4 hidden md:block">{title}</h1>}
            {children}
          </main>
          
          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center z-10">
            {mainNavItems.map((item) => {
              const isActive = window.location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex flex-col items-center py-3 px-2 flex-1 ${
                    isActive ? "text-silai-600" : "text-gray-500"
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
