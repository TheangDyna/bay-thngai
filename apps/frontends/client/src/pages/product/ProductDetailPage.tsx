// src/pages/product/ProductDetailPage.tsx
import { useProductQuery } from "@/api/product";
import NextButton from "@/components/commons/NextButton";
import PrevButton from "@/components/commons/PrevButton";
import ShareLink from "@/components/commons/ShareLink";
import { WishlistButton } from "@/components/commons/WishlistButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/cart.context";
import { RatingBreakdown } from "@/pages/product/RatingBreakdown";
import { ReviewForm } from "@/pages/product/ReviewForm";
import { ReviewList } from "@/pages/product/ReviewList";
import { calculateDiscountedPrice } from "@/utils/price";
import { format } from "date-fns";
import { Minus, Plus, Star, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const {
    data: productResponse,
    isLoading,
    isError
  } = useProductQuery(productId!);

  const product = productResponse?.data ?? null;

  // 1) All hooks before any return
  const [activeIdx, setActiveIdx] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    // reset gallery & share panel on product change
    setActiveIdx(0);
    setShareOpen(false);
  }, [product?._id]);

  const thumbnails = useMemo(
    () => (product ? [product.thumbnail, ...(product.images ?? [])] : []),
    [product]
  );

  const { isDiscountActive, finalPrice } = calculateDiscountedPrice(
    product?.price ?? 0,
    product?.discount
  );

  const qtyInCart =
    cart.find((item) => item.id === product?._id)?.quantity || 0;

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

  // 2) Early returns after hooks
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <Skeleton className="h-[342px] w-full mb-6 rounded-md" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center text-red-600 mt-20">
        Oops — couldn’t load that product.
      </div>
    );
  }

  // 3) Render once we know we have a product
  return (
    <div>
      <div className="max-w-5xl mx-auto p-10 space-y-10 border-x">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-auto">
            {thumbnails.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-24 h-24 border rounded-lg overflow-hidden ${
                  activeIdx === i ? "border-primary" : "border-muted"
                }`}
              >
                <img
                  src={src}
                  alt={`${product.name} thumbnail ${i}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Carousel */}
          <div className="relative flex-1 rounded-2xl border h-fit overflow-hidden">
            <Carousel>
              <CarouselContent>
                {thumbnails.map((src, i) => (
                  <CarouselItem
                    key={i}
                    className={activeIdx !== i ? "hidden" : "h-full"}
                  >
                    <Card className="h-[342px] w-full border-none mx-auto">
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
                      On Sale
                    </span>
                  ) : (
                    <span className="text-white w-fit h-fit bg-red-500 text-xs font-semibold px-2 py-1 rounded-full">
                      Sold Out
                    </span>
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

              {isDiscountActive && (
                <div className="text-sm text-orange-600 bg-orange-100 px-2 py-1 w-fit rounded">
                  {product.discount.amount}
                  {product.discount.type === "percentage"
                    ? "% OFF"
                    : "$ OFF"}{" "}
                  until {format(new Date(product.discount!.endDate), "PPpp")}
                </div>
              )}

              <div className="flex items-center gap-4">
                {product.ratingsAverage && (
                  <div className="flex items-center gap-1">
                    <div className="flex items-center text-yellow-500">
                      <Star size={16} fill="currentColor" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.ratingsAverage}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({product.ratingsQuantity})
                    </span>
                  </div>
                )}
                {product.sold > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {product.sold} Sold
                  </div>
                )}

                {isDiscountActive && (
                  <span className="w-fit bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {product.discount.amount}
                    {product.discount.type === "percentage" ? "% OFF" : "$ OFF"}
                  </span>
                )}
              </div>
              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.cuisines.map((cuisine, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="max-w-[120px]"
                  >
                    <span className="text-nowrap truncate">{cuisine.name}</span>
                  </Badge>
                ))}
              </div>
            </div>

            <hr className="mt-6" />
            {/* Cart + Actions */}
            <div className="flex flex-col items-center mt-6 space-y-4">
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
                <Button variant="outline" onClick={() => setShareOpen(true)}>
                  <Upload />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg font-semibold mb-2">What Customers Think</h3>
            <RatingBreakdown productId={product._id} />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Share Your Experience
              </h3>
              <ReviewForm productId={product._id} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What People Are Saying
              </h3>
              <ReviewList productId={product._id} />
            </div>
          </div>
        </div>
      </div>
      <ShareLink
        isOpenShareLink={shareOpen}
        onCloseShareLink={() => setShareOpen(false)}
      />
    </div>
  );
}
