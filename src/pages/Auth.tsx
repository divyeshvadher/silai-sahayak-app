
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
import { toast } from "@/components/ui/sonner";
import { Phone } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// Define schema for validation
const phoneSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15)
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits")
});

const Auth = () => {
  const { user, signInWithOtp, verifyOtp } = useAuth();
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isResending, setIsResending] = useState(false);
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
    try {
      setIsResending(true);
      const { error } = await signInWithOtp(values.phone);
      if (!error) {
        setOtpSent(true);
        setPhoneNumber(values.phone);
        otpForm.setValue("otp", ""); // Reset OTP in the form
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOTP = async (values: z.infer<typeof otpSchema>) => {
    try {
      const { error } = await verifyOtp(phoneNumber, values.otp);
      if (!error) {
        toast.success("Login successful!");
        // Add a slight delay before navigation to ensure auth context is updated
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 300);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    // Reset OTP fields
    otpForm.setValue("otp", "");
    
    try {
      const { error } = await signInWithOtp(phoneNumber);
      if (!error) {
        toast.success("OTP sent again!");
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
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
              ? `Enter the OTP sent to +91 ${phoneNumber}`
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
                            inputMode="numeric"
                            pattern="[0-9]*" 
                            autoComplete="tel"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={phoneForm.formState.isSubmitting}>
                  <Phone className="mr-2 h-4 w-4" /> 
                  {phoneForm.formState.isSubmitting ? "Sending..." : "Send OTP"}
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
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={otpForm.formState.isSubmitting}
                >
                  {otpForm.formState.isSubmitting ? "Verifying..." : "Verify & Login"}
                </Button>
                
                <div className="text-center mt-4 flex justify-between">
                  <Button 
                    variant="link" 
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      otpForm.reset();
                    }}
                  >
                    Change phone number
                  </Button>
                  
                  <Button 
                    variant="link"
                    type="button"
                    disabled={isResending}
                    onClick={handleResendOTP}
                  >
                    {isResending ? "Sending..." : "Resend OTP"}
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
