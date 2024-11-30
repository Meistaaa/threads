"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Monitor, Lock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { OTPFormValues, otpSchema } from "@/app/schemas/otpFormSchema";
import { useParams, useRouter } from "next/navigation";
import { OTPInput } from "@/components/OtpInput/OtpInput";

export default function VerificationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const router = useRouter();
  const { username } = useParams();
  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: OTPFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await axios.post("/api/verify-code", {
        code: data.otp,
        username,
      });
      if (response.data.success) {
        toast({
          title: "Verification Successful",
          description: "Your OTP has been verified successfully.",
          variant: "default",
        });
        router.replace("/sign-in");
        // Here you might want to redirect the user or update the UI
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "An error occurred during verification."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      toast({
        title: "Verification Failed",
        description:
          "There was a problem verifying your OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-6">
          <div className="w-16 h-16 mx-auto relative">
            <div className="absolute inset-0 bg-sky-100 rounded-lg">
              <Monitor className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-500" />
            </div>
            <Lock className="w-6 h-6 absolute bottom-0 right-0 text-yellow-500 translate-x-1/4 translate-y-1/4" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Verification code
            </h2>
            <p className="text-sm text-muted-foreground">
              We have sent a verification code to your registered mobile number.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center">
              <OTPInput
                value={form.watch("otp")}
                onChange={(value) => {
                  form.setValue("otp", value, { shouldValidate: true });
                }}
              />
            </div>
            {form.formState.errors.otp && (
              <p className="text-sm text-red-500 text-center">
                {form.formState.errors.otp.message}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-sky-400 hover:bg-sky-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
