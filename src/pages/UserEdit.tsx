
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Layout from "@/components/Layout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface UserFormData {
  full_name: string;
  phone_number: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
}

const UserEdit = () => {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal-info");

  const form = useForm<UserFormData>({
    defaultValues: {
      full_name: profile?.full_name || "",
      phone_number: profile?.phone_number || "",
      email: profile?.email || "",
      address: "",
      city: "",
      state: "",
      postal_code: ""
    },
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || "",
        phone_number: profile.phone_number || "",
        email: profile.email || "",
        address: "",
        city: "",
        state: "",
        postal_code: ""
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: UserFormData) => {
    if (!profile?.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          phone_number: data.phone_number,
        })
        .eq('id', profile.id);

      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="My Profile">
      <div className="max-w-4xl mx-auto">
        <div className="silai-card mb-6">
          <h2 className="text-xl font-semibold mb-2">My Profile</h2>
          <p className="text-gray-400 text-sm">View and manage your personal information and measurements.</p>
        </div>

        <div className="silai-card">
          <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
          <p className="text-gray-400 text-sm mb-6">View and update your personal information.</p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800">
              <TabsTrigger 
                value="personal-info"
                className={`silai-tab ${activeTab === "personal-info" ? "silai-tab-active" : ""}`}>
                Personal Info
              </TabsTrigger>
              <TabsTrigger 
                value="address"
                className={`silai-tab ${activeTab === "address" ? "silai-tab-active" : ""}`}>
                Address
              </TabsTrigger>
            </TabsList>
            <TabsContent value="personal-info" className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} className="bg-gray-900 border-gray-800" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="your.email@example.com" 
                              {...field} 
                              disabled 
                              className="bg-gray-900 border-gray-800 opacity-70" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} className="bg-gray-900 border-gray-800" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-white text-black hover:bg-gray-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Edit Profile'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="address" className="space-y-4">
              <Form {...form}>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your street address" {...field} className="bg-gray-900 border-gray-800" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your city" {...field} className="bg-gray-900 border-gray-800" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your state" {...field} className="bg-gray-900 border-gray-800" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your postal code" {...field} className="bg-gray-900 border-gray-800" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <Button 
                      type="button" 
                      className="bg-white text-black hover:bg-gray-300"
                    >
                      Save Address
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default UserEdit;
