import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

import { LoginInput } from "@/types/auth.types";
import { useLoginMutation, useGoogleLoginMutation } from "@/api/auth.api";
import { LoginSchema } from "@/validators/auth.validators";

const defaultValues: Partial<LoginInput> = {
  email: "",
  password: ""
};

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues
  });

  const loginMutation = useLoginMutation();
  const googleLoginMutation = useGoogleLoginMutation();

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        toast({ description: res.message });
        form.reset();
        navigate("/dashboard", { replace: true });
      },
      onError: (err: any) => {
        toast({
          description:
            err.response?.data?.message ||
            "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  const handleGoogleLogin = () => {
    googleLoginMutation.mutate(undefined, {
      onSuccess: (res) => {
        // redirect to Google OAuth
        window.location.href = res.data;
      },
      onError: (err: any) => {
        toast({
          description: err.response?.data?.message || "An error occurred",
          variant: "destructive"
        });
      }
    });
  };

  const handleFacebookLogin = () => {
    // implement facebook login mutation if available
    toast({ description: "Facebook login not set up yet." });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-[16px] hover:bg-secondary/5 hover:text-secondary"
        >
          <LogIn /> Sign In
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[1025px] rounded-[16px] p-0 m-0 flex">
        {/* Left image */}
        <div className="w-full h-[600px]">
          <img
            src="/login.webp"
            alt="login-bg"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right form */}
        <div className="w-[500px] h-[600px] flex flex-col items-center justify-center p-8">
          <img
            src="/bay-thngai-logo.svg"
            alt="logo"
            className="h-[100px] w-[100px]"
          />
          <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
          <span className="text-sm mb-6">
            Don’t have an account?
            <Link to="/signup">
              <Button variant="link" className="text-primary ml-1">
                Create Account
              </Button>
            </Link>
          </span>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col items-center space-y-4"
          >
            {/* Email */}
            <div className="grid w-full max-w-sm gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="grid w-full max-w-sm gap-1.5 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...form.register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-8 p-0 hover:bg-transparent focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Remember & forgot */}
            <div className="w-full flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Switch id="remember-me" />
                <Label htmlFor="remember-me">Remember me</Label>
              </div>
              <Link to="/forgot-password">
                <Button variant="link" className="text-primary">
                  Forgot Password?
                </Button>
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full mt-4 rounded-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <Label className="my-4">Or login with</Label>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="flex items-center space-x-2 rounded-full"
              onClick={handleGoogleLogin}
              disabled={googleLoginMutation.isPending}
            >
              <img src="/google.webp" alt="Google" className="h-5 w-5" />
              <span>Google</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 rounded-full"
              onClick={handleFacebookLogin}
            >
              <img src="/facebook.png" alt="Facebook" className="h-5 w-5" />
              <span>Facebook</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignIn;
