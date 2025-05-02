
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { LogOut, Home, Users, ShoppingBag, Palette, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "./ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { signOut, profile } = useAuth();

  const navItems = [
    { path: "/", icon: <Home className="w-5 h-5" />, label: "Home" },
    { path: "/customers", icon: <Users className="w-5 h-5" />, label: "Customers" },
    { path: "/orders", icon: <ShoppingBag className="w-5 h-5" />, label: "Orders" },
    { path: "/designs", icon: <Palette className="w-5 h-5" />, label: "Designs" },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full flex">
        <Sidebar>
          <SidebarContent className="flex flex-col justify-between h-full">
            {/* Mobile view: Logo at top */}
            <div className="md:mb-8 p-4">
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.svg" alt="Silai Sahayak Logo" className="w-8 h-8" />
                <h1 className="text-xl font-bold">Silai Sahayak</h1>
              </Link>
            </div>

            {/* Desktop view: Navigation below logo */}
            <div className="hidden md:block flex-1">
              <SidebarMenu>
                {navItems.map((item) => (
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
            </div>

            {/* Desktop view: User profile at bottom */}
            {profile && (
              <div className="hidden md:block">
                <SidebarFooter>
                  <div className="border-t border-gray-200 pt-4 mt-4 p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-silai-600 text-white flex items-center justify-center mr-2">
                        {profile.full_name ? profile.full_name[0] : '👤'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{profile.full_name || 'User'}</p>
                        <p className="text-xs text-gray-500">{profile.phone_number}</p>
                      </div>
                    </div>
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
              </div>
            )}

            {/* Mobile view: Navigation at bottom */}
            <div className="md:hidden mt-auto">
              <SidebarMenu className="border-t border-gray-200 pt-2">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.label}
                      isActive={window.location.pathname === item.path}
                    >
                      <Link to={item.path} className="flex items-center justify-center flex-col py-2">
                        {item.icon}
                        <span className="text-xs mt-1">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {profile && (
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={signOut}
                      tooltip="Sign Out"
                    >
                      <div className="flex items-center justify-center flex-col py-2">
                        <LogOut className="w-5 h-5 text-red-600" />
                        <span className="text-xs mt-1 text-red-600">Sign Out</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="bg-white border-b p-3 flex items-center md:hidden">
            <SidebarTrigger className="mr-2">
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
            {title && <h1 className="text-xl font-bold">{title}</h1>}
          </div>
          <main className="flex-1 p-4 md:p-6">
            {title && <h1 className="text-2xl font-bold mb-4 hidden md:block">{title}</h1>}
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
