// src/components/commons/ProductList.tsx
import { CardProduct } from "@/components/commons/CardProduct";
import { useCart } from "@/contexts/cart.context";
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
  oldest: "createdAt"
};

export interface ProductListProps {
  sortBy: string;
  cuisines: any; // ← new
  onSelectProduct: (p: Product) => void;
  onCountChange: (count: number) => void; // ← new
}

const ProductList: React.FC<ProductListProps> = ({
  sortBy,
  cuisines,
  onSelectProduct,
  onCountChange
}) => {
  const { cart, addToCart } = useCart();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery<{ data: Product[]; total: number }, Error>({
      queryKey: ["products", sortBy, cuisines],
      queryFn: async ({ pageParam = 1 }) => {
        const params: Record<string, any> = {
          page: pageParam,
          limit: ITEMS_PER_PAGE
        };
        // sort
        const sp = SORT_MAP[sortBy];
        if (sp) params.sort = sp;
        // cuisine filter
        if (Array.isArray(cuisines) && cuisines.length) {
          params.cuisines = cuisines.map((c: any) => c._id);
        }

        console.log(params);

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

  // inform parent of total count
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
    (product: Product, qty: number) =>
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.thumbnail
      }),
    [addToCart]
  );

  return (
    <>
      <div className="grid grid-cols-3 gap-4 px-2 pb-4">
        {allProducts.map((product) => {
          const qty = cart.find((c) => c.id === product._id)?.quantity || 0;
          return (
            <CardProduct
              key={product._id}
              image={product.thumbnail}
              title={product.name}
              price={`$${product.price.toFixed(2)}`}
              unit="1 pc"
              cartQty={qty}
              onAddToCart={(q) => handleAddToCart(product, q)}
              onViewDetails={() => onSelectProduct(product)}
              onClickProductModalDetails={() => onSelectProduct(product)}
            />
          );
        })}

        {isFetchingNextPage && (
          <div className="col-span-3 flex justify-center py-4">
            <Loader2 className="animate-spin text-gray-500" size={24} />
          </div>
        )}

        {!hasNextPage && (
          <div className="col-span-3 text-center py-4">
            Nothing more to load
          </div>
        )}
      </div>

      {isFetching && !isFetchingNextPage && (
        <div className="py-2 text-center">Background updating...</div>
      )}
    </>
  );
};

export default ProductList;
