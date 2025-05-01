
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Platform, StatusBar } from "./utils/platform";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Designs from "./pages/Designs";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

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
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/designs" element={<ProtectedRoute><Designs /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    // For mobile, start with the Index page
    // In a real app, you would implement native navigation here
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
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppContent />
        {Platform.OS !== 'web' && <StatusBar style="auto" />}
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
