import { useGetMeQuery, useLogoutMutation } from "@/api/auth";
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
import { useNavigate } from "react-router-dom";

export const UserNav: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetMeQuery();
  const { mutate } = useLogoutMutation();

  const handleLogout = () => {
    mutate(undefined, {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="@profile" />
            <AvatarFallback>
              {user.data.email.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.data.email.split("@")[0]}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.data.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
