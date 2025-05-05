import { useGetMeQuery, useLogoutMutation } from "@/api/auth.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import SignIn from "@/pages/auth/SignIn";
import { useNavigate } from "react-router-dom";

export const UserNav: React.FC = () => {
  const navigate = useNavigate();
  const getMeQuery = useGetMeQuery();
  const logoutMutation = useLogoutMutation();

  if (getMeQuery.isPending) {
    return <div>Loading</div>;
  }

  if (getMeQuery.isError) {
    return <div>Error</div>;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: (response) => {
        toast({
          description: response.message,
          variant: "default"
        });
        navigate("/login", { replace: true });
      },
      onError: (error: any) => {
        toast({
          description: error.response?.data?.message || "An error occurred",
          variant: "destructive"
        });
      }
    });
  };

  const user = getMeQuery.data.data;
  const initials = `${user.email[0]}`.toUpperCase();

  return (
    <div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="@profile" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p>{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <SignIn />
      )}
    </div>
  );
};
