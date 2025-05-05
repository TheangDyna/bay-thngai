// src/pages/GrocerySection/Product/ProductDetailModal.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import PrevButton from "@/components/base/PrevButton";
import NextButton from "@/components/base/NextButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, Share, ShoppingBag, Tag } from "lucide-react";
import ShareLink from "@/components/base/ShareLink";
import { useState } from "react";
import type { Product } from "@/types/product.types";
import { useAddToCartMutation } from "@/api/cart.api";
import { toast } from "@/hooks/use-toast";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [thumbIdx, setThumbIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);

  const { mutateAsync: addToCart, isPending: isAdding } =
    useAddToCartMutation();

  if (!product) return null;

  const { thumbnail, images, name, price, description, _id } = product;
  const thumbnails = [thumbnail, ...images];

  // demo values—replace with real props if added to Product type
  const unit = "1 pc";
  const originalPrice = price + 100;
  const discount = 10;
  const stock = 10;
  const tags = ["food", "fresh"];

  const increment = () => setQty((q) => q + 1);
  const decrement = () => setQty((q) => Math.max(1, q - 1));

  const handleAdd = async () => {
    try {
      // call the mutation
      await addToCart({ productId: _id, quantity: qty });
      toast({ description: `${name} (×${qty}) added to cart!` });
      onClose();
    } catch (err: any) {
      toast({
        description: err.response?.data?.message || "Failed to add to cart",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90%]">
        <div className="h-[90vh] overflow-y-auto p-4">
          <div className="flex gap-6">
            {/* Thumbnails */}
            <div className="flex flex-col space-y-3">
              {thumbnails.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setThumbIdx(idx)}
                  className={`w-24 h-24 border rounded-lg overflow-hidden cursor-pointer ${
                    thumbIdx === idx ? "border-primary" : "border-gray-200"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${name}-${idx}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative w-1/2 h-[500px]">
              <Carousel value={thumbIdx} onChange={setThumbIdx}>
                <CarouselContent>
                  {thumbnails.map((imgUrl, idx) => (
                    <CarouselItem
                      key={idx}
                      className={`h-full rounded-lg ${
                        idx !== thumbIdx ? "hidden" : ""
                      }`}
                    >
                      <Card className="h-full w-full bg-white">
                        <CardContent className="flex items-center justify-center">
                          <img
                            src={imgUrl}
                            alt={`${name}-${idx}`}
                            className="object-contain h-[400px]"
                          />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <PrevButton
                  onClick={() =>
                    setThumbIdx((i) =>
                      i === 0 ? thumbnails.length - 1 : i - 1
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                />
                <NextButton
                  onClick={() =>
                    setThumbIdx((i) =>
                      i === thumbnails.length - 1 ? 0 : i + 1
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                />
              </Carousel>
            </div>

            {/* Details */}
            <div className="w-1/2 space-y-4">
              <h2 className="text-2xl font-semibold">{name}</h2>
              <div className="text-sm text-gray-600">{unit}</div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold">${price.toFixed(2)}</span>
                <del className="text-gray-400">${originalPrice.toFixed(2)}</del>
                <Badge variant="outline">{discount}% Off</Badge>
              </div>
              <div className="text-sm text-red-600">
                {stock > 0 ? `Only ${stock} left!` : "Out of stock"}
              </div>

              {/* Quantity */}
              <div className="flex items-center space-x-4">
                <Button size="icon" onClick={decrement}>
                  <Minus />
                </Button>
                <span>{qty}</span>
                <Button size="icon" onClick={increment}>
                  <Plus />
                </Button>
              </div>

              {/* Add to Cart */}
              <Button
                className="flex items-center space-x-2 mt-4 w-full"
                onClick={handleAdd}
                disabled={isAdding}
              >
                {isAdding ? (
                  "Adding…"
                ) : (
                  <>
                    <ShoppingBag />
                    <span>Add to Cart</span>
                  </>
                )}
              </Button>

              {/* Wishlist / Share */}
              <div className="flex space-x-2 mt-2">
                <Button variant="outline" size="icon">
                  <Heart />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShareOpen(true)}
                >
                  <Share />
                </Button>
              </div>
              <ShareLink
                isOpen={shareOpen}
                onClose={() => setShareOpen(false)}
              />

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="mt-6">
                <h3 className="font-medium mb-1">Product Details</h3>
                <p className="text-sm text-gray-700">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
