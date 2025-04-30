
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Platform, StatusBar } from "./utils/platform";
import Index from "./pages/Index";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Designs from "./pages/Designs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Use different routing based on platform
const AppContent = () => {
  if (Platform.OS === 'web') {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/designs" element={<Designs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    // For mobile, start with the Index page
    // In a real app, you would implement native navigation here
    return <Index />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
      {Platform.OS !== 'web' && <StatusBar style="auto" />}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
