import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle, Soup } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useGoogleLoginMutation, useLoginMutation } from "@/api/auth.api";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Invalid email address"),
  password: z.string().trim().min(1, "Password is required")
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema)
  });

  const loginMutation = useLoginMutation();
  const googleLoginMutation = useGoogleLoginMutation();

  const onSubmit = (data: LoginFormInputs) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        toast({
          description: response.message,
          variant: "default"
        });

        reset();
        navigate("/dashboard", { replace: true });
      },
      onError: (error: any) => {
        toast({
          description: error.response?.data?.message || "An error occurred",
          variant: "destructive"
        });
      }
    });
  };

  const handleGoogleLogin = () => {
    googleLoginMutation.mutate(undefined, {
      onSuccess: (response) => {
        window.location.href = response.data;
      },
      onError: (error) => {
        toast({
          description: error.response?.data?.message || "An error occurred",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="w-full relative min-h-screen flex-col items-center justify-center grid lg:max-w-none grid-cols-1 lg:grid-cols-2 px-4 lg:px-0">
      <CardSpotlight className="relative hidden h-full flex-col bg-zinc-800 p-10 text-white lg:flex rounded-none border-0 dark:border-r overflow-clip inset-0">
        <div className="relative z-20 flex items-center text-lg font-medium space-x-2">
          <Soup />
          <h2>Bay Thngai</h2>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;One cannot think well, love well, sleep well, if one has
              not dined well.&rdquo; — Virginia Woolf
            </p>
          </blockquote>
        </div>
      </CardSpotlight>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Log In</h1>
            <p className="text-sm text-muted-foreground">
              Log in to your account to continue.
            </p>
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={
                      loginMutation.isPending || googleLoginMutation.isPending
                    }
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    autoCorrect="off"
                    disabled={
                      loginMutation.isPending || googleLoginMutation.isPending
                    }
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={
                    loginMutation.isPending || googleLoginMutation.isPending
                  }
                >
                  {(loginMutation.isPending ||
                    googleLoginMutation.isPending) && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Log In with Email
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              type="button"
              disabled={
                loginMutation.isPending || googleLoginMutation.isPending
              }
              onClick={handleGoogleLogin}
            >
              {loginMutation.isPending || googleLoginMutation.isPending ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
