import { CardProduct } from "@/components/commons/CardProduct";
import { useCart } from "@/contexts/cart.context";
import { Cuisine } from "@/types/cuisine.types";
import type { Product } from "@/types/product.types";
import axiosInstance from "@/utils/axiosInstance";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useCallback, useEffect } from "react";

const ITEMS_PER_PAGE = 12;
const SORT_MAP: Record<string, string | undefined> = {
  "lowest-price": "price",
  "highest-price": "-price",
  newest: "-createdAt",
  oldest: "createdAt",
  "top-rated": "-ratingsAverage",
  "most-sold": "-sold"
};

interface ProductListProps {
  sortBy: string;
  cuisines: Cuisine[];
  search?: string;
  onSelectProduct: (p: Product) => void;
  onCountChange: (count: number) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  sortBy,
  cuisines,
  search = "",
  onSelectProduct,
  onCountChange
}) => {
  const { cart, addToCart } = useCart();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery<{ data: Product[]; total: number }, Error>({
      queryKey: ["products", sortBy, cuisines, search],
      queryFn: async ({ pageParam = 1 }) => {
        const params: Record<string, any> = {
          page: pageParam,
          limit: ITEMS_PER_PAGE
        };
        // sort
        const sp = SORT_MAP[sortBy];
        if (sp) params.sort = sp;
        // filters
        if (Array.isArray(cuisines) && cuisines.length) {
          params.cuisines = cuisines.map((c: Cuisine) => c._id);
        }

        if (search) params.search = search;
        const res = await axiosInstance.get("/products", { params });
        return res.data;
      },
      getNextPageParam: (last, pages) =>
        pages.length * ITEMS_PER_PAGE < last.total
          ? pages.length + 1
          : undefined,
      initialPageParam: 1
    });

  const allProducts = data?.pages.flatMap((pg) => pg.data) ?? [];
  const total = data?.pages[0].total ?? 0;

  useEffect(() => {
    onCountChange(total);
  }, [total, onCountChange]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 100 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleAddToCart = useCallback(
    (product: Product, amount: number) => {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        quantity: amount,
        image: product.thumbnail
      });
    },
    [addToCart]
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allProducts.map((product) => {
          const qty = cart.find((c) => c.id === product._id)?.quantity || 0;
          return (
            <CardProduct
              key={product._id}
              image={product.thumbnail}
              title={product.name}
              price={product.price}
              cartQty={qty}
              onAddToCart={(amount) => handleAddToCart(product, amount)}
              onViewDetails={() => onSelectProduct(product)}
              onClickProductModalDetails={() => onSelectProduct(product)}
              ratingsAverage={product.ratingsAverage}
              ratingsQuantity={product.ratingsQuantity}
              sold={product.sold}
              discount={product.discount}
              inStock={product.inStock}
            />
          );
        })}
      </div>
      {isFetchingNextPage && (
        <div className="flex flex-1 justify-center">
          <Loader2 className="animate-spin text-gray-500" size={24} />
        </div>
      )}

      {!hasNextPage && (
        <div className="flex flex-1 justify-center text-muted-foreground">
          — That's all —
        </div>
      )}

      {isFetching && !isFetchingNextPage && (
        <div className="flex flex-1 justify-center text-muted-foreground">
          Background updating...
        </div>
      )}
    </>
  );
};
