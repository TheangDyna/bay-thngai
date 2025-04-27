import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, LogIn } from "lucide-react";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

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
      <DialogContent className="max-w-[1025px] rounded-[16px] overflow-hidden p-0 m-0 flex items-center justify-between">
        <div className="max-w-full h-[600px]">
          <img
            src="/login.webp"
            alt="login-background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-[500px] h-[600px] flex flex-col items-center justify-center p-8">
          <img
            src="/bay-thngai-logo.svg"
            alt="logo"
            className="h-[100px] w-[100px]"
          />
          <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
          <span className="text-sm">
            Don’t have an account?
            <Button variant="link" className="text-primary ml-1">
              Create Account
            </Button>
          </span>
          <div className="w-full flex flex-col items-center space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-5 hover:bg-transparent hover:outline-none focus:outline-none  text-secondary hover:text-primary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </Button>
            </div>
          </div>
          <div className="w-full flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Switch id="remember-me" />
              <Label htmlFor="remember-me">Remember me</Label>
            </div>
            <Button variant="link" className="text-primary">
              Forgot Password?
            </Button>
          </div>
          <Button className="w-full mt-4 rounded-full">Sign In</Button>
          <Label className="my-4">Or Login with </Label>
          <div className="flex space-x-4 mt-2">
            <Button
              variant="outline"
              className="flex items-center space-x-2 hover:outline-none hover:bg-transparent hover:text-primary rounded-full"
            >
              <img src="/google.webp" alt="Google" className="h-5 w-5" />
              <span>Google</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 hover:outline-none hover:bg-transparent hover:text-primary rounded-full"
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
