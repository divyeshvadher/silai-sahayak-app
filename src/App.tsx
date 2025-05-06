import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Homepage from "./pages/Homepage";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import NewOrder from "./pages/NewOrder";
import Customers from "./pages/Customers";
import Designs from "./pages/Designs";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import UserEdit from "./pages/UserEdit";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Index />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/orders/new" element={<NewOrder />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/designs" element={<Designs />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/user-edit" element={<UserEdit />} />
          </Route>
          
          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </Router>
  );
}

export default App;
