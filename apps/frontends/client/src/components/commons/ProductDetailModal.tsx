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
import { RatingBreakdown } from "@/pages/product/RatingBreakdown";
import { ReviewForm } from "@/pages/product/ReviewForm";
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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full p-6">
        <div className="w-full px-4 py-8 space-y-10">
          {/* Product Section */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-auto">
              {thumbnails.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-24 h-24 rounded-lg overflow-hidden border ${
                    activeIdx === idx ? "border-primary" : "border-muted"
                  }`}
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
            <div className="relative flex-1 h-1/2 rounded-2xl border overflow-hidden">
              <Carousel
                value={activeIdx}
                onChange={setActiveIdx}
                className="h-full"
              >
                <CarouselContent>
                  {thumbnails.map((src, idx) => (
                    <CarouselItem
                      key={idx}
                      className={activeIdx !== idx ? "hidden" : "h-full"}
                    >
                      <Card className="h-full w-full border-none">
                        <CardContent className="flex items-center justify-center h-full p-2">
                          <img
                            src={src}
                            alt={`${name} view ${idx}`}
                            className="h-full w-full object-contain rounded-xl"
                          />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <PrevButton
                  onClick={() =>
                    setActiveIdx((i) =>
                      i === 0 ? thumbnails.length - 1 : i - 1
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
                />
                <NextButton
                  onClick={() =>
                    setActiveIdx((i) =>
                      i === thumbnails.length - 1 ? 0 : i + 1
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                />
              </Carousel>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{name}</h1>
                <p className="text-sm text-muted-foreground">{unitLabel}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-2xl font-bold text-primary">
                    ${price.toFixed(2)}
                  </span>
                  <del className="text-muted-foreground">
                    ${originalPrice.toFixed(2)}
                  </del>
                  <Badge variant="outline">{discountPercent}% Off</Badge>
                </div>
                <p className="text-sm text-red-600">
                  {stock > 0 ? `Only ${stock} left` : "Out of stock"}
                </p>
              </div>

              {/* Quantity & Cart */}
              <div className="flex items-center gap-3">
                <Button size="icon" onClick={decrement}>
                  <Minus />
                </Button>
                <span className="text-lg text-center w-10">{quantity}</span>
                <Button size="icon" onClick={increment}>
                  <Plus />
                </Button>
                <Button onClick={handleAddToCart} className="flex gap-2">
                  <ShoppingBag size={20} /> Add to Cart
                </Button>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
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
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              <div className="pt-4 border-t">
                <h3 className="font-semibold text-lg mb-1">Product Details</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">What Customers Think</h3>
              <RatingBreakdown productId={product._id} />
            </div>

            {/* Reviews Section */}

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Share Your Experience</h3>
              <ReviewForm productId={product._id} />
            </div>
          </div>

          {/* Related */}
          {/* <div className="space-y-4">
        <h2 className="text-xl font-semibold">You may also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
