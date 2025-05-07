
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Platform, StatusBar } from "./utils/platform";
import { AuthProvider } from "./contexts/AuthContext";
import Homepage from "./pages/Homepage";
import Index from "./pages/Index";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import NewOrder from "./pages/NewOrder";
import OrderDetail from "./pages/OrderDetail";
import Designs from "./pages/Designs";
import UserEdit from "./pages/UserEdit";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Use different routing based on platform
const AppContent = () => {
  if (Platform.OS === 'web') {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthRedirect><Homepage /></AuthRedirect>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/orders/new" element={<ProtectedRoute><NewOrder /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          <Route path="/designs" element={<ProtectedRoute><Designs /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserEdit /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    // For mobile, start with the dashboard
    return (
      <>
        <Auth />
        {/* Mobile navigation would go here */}
      </>
    );
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
        {Platform.OS !== 'web' && <StatusBar style="auto" />}
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
