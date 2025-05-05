// src/pages/GrocerySection.tsx
import React, { useState } from "react";
import CardProduct from "../../CardProduct";
import BannerHeader from "../../BannerHeader";
import ProductDetailModal from "./Product/ProductDetailModal";
import { useProductsQuery } from "@/api/product.api";
import type { Product } from "@/types/product.types";

const GrocerySection: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  return (
    <div className="px-10">
      <BannerHeader
        title="Best seller grocery near you"
        subTitle="We provide best quality & fresh grocery items near your location"
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
              onAddToCart={() => alert(`${product.name} added to cart!`)}
              onViewDetails={() => alert(`Viewing details for ${product.name}`)}
              onClickProductModalDetails={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      )}

      {/* Pass the selectedProduct (or null) + a close handler */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default GrocerySection;
