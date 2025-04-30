
import { Link } from "react-router-dom";
import Sidebar from "./ui/sidebar";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { signOut, profile } = useAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <div className="mb-8">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Silai Sahayak Logo" className="w-8 h-8 mr-2" />
            <h1 className="text-xl font-bold">Silai Sahayak</h1>
          </Link>
        </div>

        <nav className="space-y-1">
          <Link to="/" className="silai-nav-link">
            <span className="silai-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </span>
            <span>Home</span>
          </Link>
          <Link to="/customers" className="silai-nav-link">
            <span className="silai-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </span>
            <span>Customers</span>
          </Link>
          <Link to="/orders" className="silai-nav-link">
            <span className="silai-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </span>
            <span>Orders</span>
          </Link>
          <Link to="/designs" className="silai-nav-link">
            <span className="silai-nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19c-3.5 0-6-2-6-5 0-3.5 6-9 6-9s6 5.5 6 9c0 3-2.5 5-6 5Z"></path>
              </svg>
            </span>
            <span>Designs</span>
          </Link>
        </nav>

        <div className="mt-auto">
          {profile && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center mb-2">
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
          )}
        </div>
      </Sidebar>
      <main className="flex-1 p-0 md:p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
