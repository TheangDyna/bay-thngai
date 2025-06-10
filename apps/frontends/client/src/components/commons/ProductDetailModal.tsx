import NextButton from "@/components/commons/NextButton";
import PrevButton from "@/components/commons/PrevButton";
import ShareLink from "@/components/commons/ShareLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCart } from "@/contexts/cart.context";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/types/product.types";
import { Heart, Minus, Plus, Share, ShoppingBag } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const { addToCart } = useCart();

  const thumbnails = useMemo(() => {
    if (!product) return [];
    return [product.thumbnail, ...product.images];
  }, [product]);

  useEffect(() => {
    if (product) {
      setActiveIdx(0);
      setQuantity(1);
      setShareOpen(false);
    }
  }, [product]);

  if (!product) return null;

  const { _id, name, price, description } = product;
  const originalPrice = price + 100;
  const discountPercent = 10;
  const stock = 10;
  const tags = ["food", "fresh"];
  const unitLabel = "1 pc";

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    addToCart({ id: _id, name, price, quantity, image: product.thumbnail });
    toast({ description: `${name} (×${quantity}) added to cart!` });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-full p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-auto">
            {thumbnails.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`w-24 h-24 rounded-lg overflow-hidden border cursor-pointer transition-colors \$
                  {activeIdx === idx ? 'border-primary' : 'border-gray-200'}`}
              >
                <img
                  src={src}
                  alt={`${name} thumbnail ${idx}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Carousel */}
          <div className="relative flex-1 h-[500px]">
            <Carousel
              value={activeIdx}
              onChange={setActiveIdx}
              className="h-full"
            >
              <CarouselContent>
                {thumbnails.map((src, idx) => (
                  <CarouselItem
                    key={idx}
                    className={`${activeIdx !== idx && "hidden"} h-full rounded-lg`}
                  >
                    <Card className="h-full w-full">
                      <CardContent className="flex items-center justify-center">
                        <img
                          src={src}
                          alt={`${name} view ${idx}`}
                          className="max-h-[400px] object-contain"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <PrevButton
                onClick={() =>
                  setActiveIdx((i) => (i === 0 ? thumbnails.length - 1 : i - 1))
                }
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
              />
              <NextButton
                onClick={() =>
                  setActiveIdx((i) => (i === thumbnails.length - 1 ? 0 : i + 1))
                }
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              />
            </Carousel>
          </div>

          {/* Product Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{name}</h2>
              <p className="text-sm text-gray-600">{unitLabel}</p>

              <div className="mt-2 flex items-center space-x-3">
                <span className="text-2xl font-bold">${price.toFixed(2)}</span>
                <del className="text-gray-400">${originalPrice.toFixed(2)}</del>
                <Badge variant="outline">{discountPercent}% Off</Badge>
              </div>

              <p
                className={`mt-1 text-sm ${stock > 0 ? "text-red-600" : "text-gray-500"}`}
              >
                {stock > 0 ? `Only ${stock} left!` : "Out of stock"}
              </p>

              {/* Quantity & Add to Cart */}
              <div className="mt-4 flex items-center space-x-4">
                <Button size="icon" onClick={decrement}>
                  <Minus />
                </Button>
                <span className="text-lg">{quantity}</span>
                <Button size="icon" onClick={increment}>
                  <Plus />
                </Button>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag />
                  <span>Add to Cart</span>
                </Button>
              </div>

              {/* Wishlist & Share */}
              <div className="mt-4 flex space-x-2">
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
                <ShareLink
                  isOpen={shareOpen}
                  onClose={() => setShareOpen(false)}
                />
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
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
