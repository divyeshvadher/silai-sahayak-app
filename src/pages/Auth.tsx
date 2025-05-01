
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const Auth = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignupSuccess = (shopName: string) => {
    setActiveTab("login");
  };

  return (
    <AuthCard>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm onSignupClick={() => setActiveTab("signup")} />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignupForm 
            onLoginClick={() => setActiveTab("login")} 
            onSignupSuccess={handleSignupSuccess} 
          />
        </TabsContent>
      </Tabs>
    </AuthCard>
  );
};

export default Auth;
