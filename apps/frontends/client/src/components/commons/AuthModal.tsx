import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

import { useAuth } from "@/contexts/auth.context";
import {
  ConfirmRegisterInput,
  LoginInput,
  SignupInput
} from "@/types/auth.types";
import {
  ConfirmRegisterSchema,
  LoginSchema,
  SignupSchema
} from "@/validators/auth.validators";
import { Link } from "react-router-dom";

const AuthModal = () => {
  const [mode, setMode] = useState<"signin" | "signup" | "confirm">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>("");

  const {
    login,
    signup,
    confirmRegister,
    resendConfirmCode,
    googleLogin,
    isLoading
  } = useAuth();

  const signinForm = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" }
  });

  const signupForm = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" }
  });

  const confirmForm = useForm<ConfirmRegisterInput>({
    resolver: zodResolver(ConfirmRegisterSchema),
    defaultValues: { email: "", code: "" }
  });

  // when entering confirmation step, prefill email
  useEffect(() => {
    if (mode === "confirm" && pendingEmail) {
      confirmForm.reset({ email: pendingEmail, code: "" });
    }
  }, [mode, pendingEmail]);

  const onSignin = async (data: LoginInput) => {
    try {
      await login(data);
      toast({ description: "Login successful!" });
      signinForm.reset();
    } catch (err: any) {
      toast({
        description: err?.response?.data?.message || "Login failed.",
        variant: "destructive"
      });
    }
  };

  const onSignup = async (data: SignupInput) => {
    try {
      await signup(data);
      setPendingEmail(data.email);
      toast({ description: "OTP sent to your email." });
      setMode("confirm");
    } catch (err: any) {
      toast({
        description: err?.response?.data?.message || "Signup failed.",
        variant: "destructive"
      });
    }
  };

  const onConfirm = async (data: ConfirmRegisterInput) => {
    try {
      await confirmRegister(data);
      toast({ description: "Registration confirmed! You can now sign in." });
      confirmForm.reset();
      signinForm.reset();
      setMode("signin");
    } catch (err: any) {
      toast({
        description: err?.response?.data?.message || "Confirmation failed.",
        variant: "destructive"
      });
    }
  };

  const onResend = async () => {
    try {
      await resendConfirmCode({ email: pendingEmail });
      toast({ description: "OTP resent to your email." });
    } catch (err: any) {
      toast({
        description: err?.response?.data?.message || "Resend failed.",
        variant: "destructive"
      });
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
    } catch (err: any) {
      toast({
        description: err?.response?.data?.message || "Google login failed.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          {mode === "signin"
            ? "Sign In"
            : mode === "signup"
              ? "Sign Up"
              : "Confirm"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1025px] rounded-[16px] p-0 m-0 flex overflow-hidden">
        <div className="w-full h-[600px]">
          {mode === "signin" ? (
            <img
              src="/login.webp"
              alt="auth-bg"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/registration.webp"
              alt="auth-bg"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="w-[500px] h-[600px] flex flex-col items-center justify-center p-8">
          <img
            src="/bay-thngai-logo.svg"
            alt="logo"
            className="h-[100px] w-[100px]"
          />

          {mode === "signin" && (
            <>
              <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
              <span className="text-sm mb-6 text-center">
                Don’t have an account?{" "}
                <Button
                  variant="link"
                  className="text-primary p-0"
                  onClick={() => setMode("signup")}
                >
                  Create Account
                </Button>
              </span>
              <form
                onSubmit={signinForm.handleSubmit(onSignin)}
                className="w-full flex flex-col items-center space-y-4"
              >
                <div className="grid w-full max-w-sm gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...signinForm.register("email")}
                  />
                  {signinForm.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {signinForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid w-full max-w-sm gap-1.5 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...signinForm.register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/3 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                  {signinForm.formState.errors.password && (
                    <p className="text-xs text-destructive">
                      {signinForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="w-full flex items-center justify-end">
                  <Button asChild variant="link" className="text-primary">
                    <Link to="/#">Forgot Password?</Link>
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-4 rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </>
          )}

          {mode === "signup" && (
            <>
              <h1 className="text-3xl font-bold mb-2">Create Account</h1>
              <span className="text-sm mb-6 text-center">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="text-primary p-0"
                  onClick={() => setMode("signin")}
                >
                  Sign In
                </Button>
              </span>
              <form
                onSubmit={signupForm.handleSubmit(onSignup)}
                className="w-full flex flex-col items-center space-y-4"
              >
                <div className="grid w-full max-w-sm gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...signupForm.register("email")}
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid w-full max-w-sm gap-1.5 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...signupForm.register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/3 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                  {signupForm.formState.errors.password && (
                    <p className="text-xs text-destructive">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="grid w-full max-w-sm gap-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...signupForm.register("confirmPassword")}
                  />

                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full mt-4 rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </>
          )}

          {mode === "confirm" && (
            <>
              <h1 className="text-3xl font-bold mb-2">Confirm Registration</h1>
              <span className="text-sm mb-6 text-center">
                Enter the OTP sent to <strong>{pendingEmail}</strong>
              </span>
              <form
                onSubmit={confirmForm.handleSubmit(onConfirm)}
                className="w-full flex flex-col items-center space-y-4"
              >
                <div className="grid w-full max-w-sm gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    readOnly
                    {...confirmForm.register("email")}
                  />
                </div>
                <div className="grid w-full max-w-sm gap-1.5">
                  <Label htmlFor="code">OTP Code</Label>
                  <Input
                    id="code"
                    placeholder="123456"
                    {...confirmForm.register("code")}
                  />
                  {confirmForm.formState.errors.code && (
                    <p className="text-xs text-destructive">
                      {confirmForm.formState.errors.code.message}
                    </p>
                  )}
                </div>
                <div className="w-full flex items-center justify-between">
                  <Button type="button" variant="link" onClick={onResend}>
                    Resend Code
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Confirming..." : "Confirm"}
                  </Button>
                </div>
              </form>
            </>
          )}

          <Label className="my-4">Or continue with</Label>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="flex items-center space-x-2 rounded-full"
              onClick={handleGoogle}
              disabled={isLoading}
            >
              <img
                src="/social-media/google.webp"
                alt="Google"
                className="h-5 w-5"
              />
              <span>Google</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 rounded-full"
              onClick={() => toast({ description: "Facebook not set up." })}
            >
              <img
                src="/social-media/facebook.webp"
                alt="Facebook"
                className="h-5 w-5"
              />
              <span>Facebook</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
