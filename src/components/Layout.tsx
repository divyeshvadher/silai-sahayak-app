
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, FileText, Image, Menu } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {title ? (
            <h1 className="text-lg font-bold text-silai-800">{title}</h1>
          ) : (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-silai-600 flex items-center justify-center">
                <span className="text-white font-bold">सि</span>
              </div>
              <span className="ml-2 font-bold text-silai-800">Silai Sahayak</span>
            </div>
          )}
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Menu size={20} />
        </button>
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full">
        <div className="flex justify-around">
          <Link 
            to="/" 
            className={`flex flex-1 flex-col items-center py-3 ${
              isActive("/") ? "text-silai-600" : "text-gray-500"
            }`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link 
            to="/customers" 
            className={`flex flex-1 flex-col items-center py-3 ${
              isActive("/customers") ? "text-silai-600" : "text-gray-500"
            }`}
          >
            <Users size={20} />
            <span className="text-xs mt-1">Customers</span>
          </Link>
          <Link 
            to="/orders" 
            className={`flex flex-1 flex-col items-center py-3 ${
              isActive("/orders") ? "text-silai-600" : "text-gray-500"
            }`}
          >
            <FileText size={20} />
            <span className="text-xs mt-1">Orders</span>
          </Link>
          <Link 
            to="/designs" 
            className={`flex flex-1 flex-col items-center py-3 ${
              isActive("/designs") ? "text-silai-600" : "text-gray-500"
            }`}
          >
            <Image size={20} />
            <span className="text-xs mt-1">Designs</span>
          </Link>
        </div>
      </nav>
      
      {/* Bottom padding to account for the nav */}
      <div className="h-16"></div>
    </div>
  );
};

export default Layout;
