import NextButton from "@/components/commons/NextButton";
import PrevButton from "@/components/commons/PrevButton";
import ShareLink from "@/components/commons/ShareLink";
import { WishlistButton } from "@/components/commons/WishlistButton";
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
import { calculateDiscountedPrice } from "@/utils/price";
import { format } from "date-fns";
import { ExternalLink, Minus, Plus, Share2 } from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  // 0) early exit before any hooks
  if (!product) return null;

  // 1) all hooks unconditionally
  const [activeIdx, setActiveIdx] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  // 2) reset carousel/index when product changes
  useEffect(() => {
    setActiveIdx(0);
    setShareOpen(false);
  }, [product._id]);

  // 3) thumbnails
  const thumbnails = useMemo(
    () => [product.thumbnail, ...(product.images ?? [])],
    [product]
  );

  // 4) discount & pricing
  const { isDiscountActive, finalPrice } = calculateDiscountedPrice(
    product.price,
    product.discount
  );
  const discountPercent = product.discount
    ? product.discount.type === "percentage"
      ? product.discount.amount
      : Math.round((product.discount.amount / product.price) * 100)
    : 0;

  // 5) quantity in cart
  const qtyInCart = cart.find((item) => item.id === product._id)?.quantity || 0;

  // 6) change quantity handler
  const changeQty = useCallback(
    (delta: number) => {
      if (!product) return;
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        quantity: delta,
        image: product.thumbnail
      });
    },
    [addToCart, finalPrice, product]
  );

  const handleOpenDetail = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/product/${product._id}`);
    },
    [navigate, product._id]
  );

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl w-full p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-auto">
            {thumbnails.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-24 h-24 border bg-muted rounded-lg overflow-hidden ${
                  activeIdx === i ? "border-primary" : "border-muted"
                }`}
              >
                <img
                  src={src}
                  alt={`${product.name} thumb ${i}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Carousel */}
          <div className="relative flex-1 rounded-2xl border overflow-hidden">
            <Carousel>
              <CarouselContent>
                {thumbnails.map((src, i) => (
                  <CarouselItem
                    key={i}
                    className={activeIdx !== i ? "hidden" : "h-full"}
                  >
                    <Card className="h-[342px] w-[342px] border-none">
                      <CardContent className="flex items-center justify-center h-full p-4 bg-muted">
                        <img
                          src={src}
                          alt={`${product.name} view ${i}`}
                          className="h-full w-full object-contain rounded-xl"
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
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
              />
              <NextButton
                onClick={() =>
                  setActiveIdx((i) => (i === thumbnails.length - 1 ? 0 : i + 1))
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
              />
            </Carousel>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Title & Badges */}
              <div>
                <div className="flex pr-4">
                  <h2 className="text-2xl font-bold flex-1">{product.name}</h2>
                  {product.inStock ? (
                    <span className="text-white w-fit h-fit bg-primary text-xs font-semibold px-2 py-1 rounded-full">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-white w-fit h-fit bg-red-500 text-xs font-semibold px-2 py-1 rounded-full">
                      Sold Out
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {isDiscountActive && (
                    <div className="text-sm text-orange-600 bg-orange-100 px-2 py-1 w-fit rounded">
                      {discountPercent}
                      {product.discount!.type === "percentage"
                        ? "% OFF"
                        : "$ OFF"}{" "}
                      until{" "}
                      {format(new Date(product.discount!.endDate), "PPpp")}
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-extrabold">
                  ${finalPrice.toFixed(2)}
                </span>
                {isDiscountActive && (
                  <del className="text-muted-foreground">
                    ${product.price.toFixed(2)}
                  </del>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Cart + Actions */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  onClick={() => changeQty(-1)}
                  disabled={qtyInCart <= 0}
                >
                  <Minus />
                </Button>
                <span className="text-lg w-10 text-center">{qtyInCart}</span>
                <Button size="icon" onClick={() => changeQty(1)}>
                  <Plus />
                </Button>
              </div>

              <div className="flex gap-2">
                <WishlistButton productId={product._id} />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShareOpen(true)}
                >
                  <Share2 />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleOpenDetail}
                >
                  <ExternalLink />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">What Customers Think</h3>
            <RatingBreakdown productId={product._id} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Share Your Experience
            </h3>
            <ReviewForm productId={product._id} />
          </div>
        </div>
        <ShareLink
          isOpenShareLink={shareOpen}
          onCloseShareLink={() => setShareOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
