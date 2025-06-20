import { useGetWishlistQuery } from "@/api/wishlist";
import { CardProduct } from "@/components/commons/CardProduct";
import { ProductDetailModal } from "@/components/commons/ProductDetailModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth.context";
import { useCart } from "@/contexts/cart.context";
import { Product } from "@/types/product.types";
import { Heart } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

export const Wishlists: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { cart, addToCart } = useCart();
  const { ref, inView } = useInView({ threshold: 0 });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    error
  } = useGetWishlistQuery({ skip: !user });

  const allProducts = data?.pages.flatMap((pg) => pg.data) ?? [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleAddToCart = useCallback(
    (product: Product, amount: number) => {
      addToCart({
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        discount: product.discount,
        quantity: amount,
        image: product.thumbnail
      });
    },
    [addToCart]
  );

  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Your Wishlist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {authLoading || (isFetching && !data) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-red-500 py-8">
              Failed to load wishlist. Please try again later.
            </p>
          ) : !user ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                Please log in to view your wishlist.
              </p>
              <Button asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          ) : allProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
              <Button asChild>
                <Link to="/search">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {allProducts.map((product: Product) => {
                  const qty =
                    cart.find((c) => c.id === product._id.toString())
                      ?.quantity || 0;
                  return (
                    <CardProduct
                      key={product._id}
                      id={product._id}
                      image={product.thumbnail}
                      title={product.name}
                      price={product.price}
                      cartQty={qty}
                      onAddToCart={(amount) => handleAddToCart(product, amount)}
                      onClickProductModalDetails={() =>
                        handleSelectProduct(product)
                      }
                      ratingsAverage={product.ratingsAverage}
                      ratingsQuantity={product.ratingsQuantity}
                      sold={product.sold}
                      discount={product.discount}
                      inStock={product.inStock}
                    />
                  );
                })}
              </div>
              <div ref={ref} className="h-6" />
              {isFetchingNextPage && (
                <div className="flex justify-center">
                  <Heart className="animate-pulse text-gray-500" size={24} />
                </div>
              )}
              {!hasNextPage && !isFetching && allProducts.length > 0 && (
                <div className="flex justify-center text-muted-foreground">
                  — End of results —
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Wishlists;
