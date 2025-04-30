
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/sonner";
import { Phone } from "lucide-react";

const phoneSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15)
});

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits")
});

const Auth = () => {
  const { user, signInWithOtp, verifyOtp } = useAuth();
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleSendOTP = async (values: z.infer<typeof phoneSchema>) => {
    const { error } = await signInWithOtp(values.phone);
    if (!error) {
      setOtpSent(true);
      setPhoneNumber(values.phone);
    }
  };

  const handleVerifyOTP = async (values: z.infer<typeof otpSchema>) => {
    const { error } = await verifyOtp(phoneNumber, values.otp);
    if (!error) {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {otpSent ? "Verify OTP" : "Login / Signup"}
          </CardTitle>
          <CardDescription>
            {otpSent 
              ? "Enter the OTP sent to your mobile number"
              : "Enter your mobile number to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(handleSendOTP)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <div className="bg-muted text-muted-foreground px-3 py-2 border border-r-0 rounded-l-md">+91</div>
                          <Input 
                            placeholder="Enter your mobile number" 
                            className="rounded-l-none" 
                            type="tel"
                            autoComplete="tel"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  <Phone className="mr-2 h-4 w-4" /> Send OTP
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP Code</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">Verify & Login</Button>
                
                <div className="text-center mt-4">
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setOtpSent(false);
                      otpForm.reset();
                    }}
                  >
                    Change phone number
                  </Button>
                  
                  <Button 
                    variant="link" 
                    onClick={() => {
                      handleSendOTP({ phone: phoneNumber });
                      otpForm.reset();
                    }}
                  >
                    Resend OTP
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Silai Sahayak - Tailor Management App
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
