import { useProductsQuery } from "@/api/product";
import BannerHeader from "@/components/commons/BannerHeader";
import { CardProduct } from "@/components/commons/CardProduct";
import { ProductDetailModal } from "@/components/commons/ProductDetailModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/cart.context";
import { Product } from "@/types/product.types";
import { AlertCircle } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export const TopRatedsSection: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  const {
    data: productsResponse,
    isLoading,
    isError
  } = useProductsQuery({
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [
      { id: "ratingsAverage", desc: true },
      { id: "ratingsQuantity", desc: true }
    ],
    columnFilters: []
  });

  const products = productsResponse?.data || [];

  const handleAddToCart = useCallback(
    (product: Product, amount: number) =>
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: amount,
        image: product.thumbnail
      }),
    [addToCart]
  );

  const renderSkeletons = () =>
    Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ));

  return (
    <div className="px-10 space-y-6">
      <BannerHeader
        title="Popular product that we sold"
        subTitle="We provide best quality & fresh grocery items near your location"
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:gap-4 2xl:gap-5 py-10">
          {renderSkeletons()}
        </div>
      ) : isError ? (
        <Alert variant="destructive" className="my-10">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Failed to load products</AlertTitle>
          <AlertDescription>
            Something went wrong while fetching products. Please try again.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:gap-4 2xl:gap-5">
            {products.map((product) => {
              const qty = cart.find((c) => c.id === product._id)?.quantity || 0;
              return (
                <CardProduct
                  key={product._id}
                  image={product.thumbnail}
                  title={product.name}
                  price={product.price}
                  cartQty={qty}
                  onAddToCart={(amount) => handleAddToCart(product, amount)}
                  onViewDetails={() => setSelectedProduct(product)}
                  onClickProductModalDetails={() => setSelectedProduct(product)}
                  ratingsAverage={product.ratingsAverage}
                  ratingsQuantity={product.ratingsQuantity}
                  sold={product.sold}
                  discount={product.discount}
                  inStock={product.inStock}
                />
              );
            })}
          </div>
          <div className="flex justify-center">
            <Button
              variant="link"
              onClick={() => navigate("/search?sort=top-rated")}
            >
              View All
            </Button>
          </div>
        </div>
      )}

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
