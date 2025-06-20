import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation
} from "@/api/wishlist";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth.context";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface WishlistButtonProps {
  productId: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const addToWishlistMutation = useAddToWishlistMutation();
  const removeFromWishlistMutation = useRemoveFromWishlistMutation();
  const { user } = useAuth();

  const [isInWishlist, setIsInWishlist] = useState<boolean>(
    user?.wishlist?.some((id: string) => id === productId) || false
  );

  useEffect(() => {
    setIsInWishlist(
      user?.wishlist?.some((id: string) => id === productId) || false
    );
  }, [user, productId]);
  const handleWishlistToggle = () => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "Please sign in to manage your wishlist.",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/login")}
            className="border-white text-white hover:bg-white hover:text-black"
          >
            Sign In
          </Button>
        )
      });
      return;
    }

    if (isInWishlist) {
      removeFromWishlistMutation.mutate(productId, {
        onSuccess: () => {
          setIsInWishlist(false);
          toast({
            description: "The product has been removed from your wishlist."
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            description: "Failed to remove product from wishlist."
          });
        }
      });
    } else {
      addToWishlistMutation.mutate(productId, {
        onSuccess: () => {
          setIsInWishlist(true);
          toast({
            description: "The product has been added to your wishlist."
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            description: "Failed to add product to wishlist."
          });
        }
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleWishlistToggle}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={isInWishlist ? "text-primary fill-primary" : ""} />
    </Button>
  );
};
