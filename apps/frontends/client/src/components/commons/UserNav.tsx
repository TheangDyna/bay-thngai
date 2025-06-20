import SignIn from "@/components/commons/AuthModal";
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
import { useAuth } from "@/contexts/auth.context";
import { useNavigate } from "react-router-dom";

export const UserNav: React.FC = () => {
  const { user, logout } = useAuth();
  const initials = user?.email[0].toUpperCase();
  const navigate = useNavigate();

  return (
    <div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10">
              <Avatar className="h-10 w-10 rounded-md">
                <AvatarImage className="rounded-md" src="" alt="@profile" />
                <AvatarFallback className="rounded-md">
                  {initials}
                </AvatarFallback>
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
              <DropdownMenuItem
                onClick={() => navigate("/profile?tab=account")}
              >
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/profile?tab=orders")}>
                Orders
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/profile?tab=wishlist")}
              >
                Wishlist
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/profile?tab=addresses")}
              >
                Addresses
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/profile?tab=contacts")}
              >
                Contacts
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <SignIn />
      )}
    </div>
  );
};
