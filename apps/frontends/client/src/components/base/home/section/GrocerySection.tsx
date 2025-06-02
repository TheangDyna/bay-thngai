// src/pages/GrocerySection.tsx
import React, { useState } from "react";
import CardProduct from "../../CardProduct";
import BannerHeader from "../../BannerHeader";
import ProductDetailModal from "./Product/ProductDetailModal";
import { useProductsQuery } from "@/api/product.api";
import type { Product } from "@/types/product.types";
import { useCartStore } from "@/stores/cart.store";
import { toast } from "@/hooks/use-toast";

const GrocerySection: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  // Fetch first page of 12 products
  const {
    data: productsResponse,
    isLoading,
    isError
  } = useProductsQuery({
    pagination: { pageIndex: 0, pageSize: 12 },
    sorting: [],
    columnFilters: []
  });

  const products = productsResponse?.data || [];

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem(product._id, 1);
      toast({ description: `${product.name} added to cart!` });
    } catch (err: any) {
      toast({ description: err.message || "Failed to add to cart" });
    }
  };

  return (
    <div className="px-10">
      <BannerHeader
        title="Best seller groceries near you"
        subTitle="We provide the best quality & fresh grocery items near your location"
      />

      {isLoading ? (
        <div className="py-20 text-center">Loading products…</div>
      ) : isError ? (
        <div className="py-20 text-center text-red-500">
          Failed to load products.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:gap-4 2xl:gap-5">
          {products.map((product) => (
            <CardProduct
              key={product._id}
              image={product.thumbnail}
              title={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              unit={product.unit || "1 pc"}
              onAddToCart={() => handleAddToCart(product)}
              onViewDetails={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default GrocerySection;
