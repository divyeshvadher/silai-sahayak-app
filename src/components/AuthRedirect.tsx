import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect = ({ children }: AuthRedirectProps) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Show a simple loading state
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-silai-500"></div>
      </div>
    );
  }
  
  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, show the public homepage
  return <>{children}</>;
};

export default AuthRedirect;
