// src/pages/Search.tsx
import { CuisineFilter } from "@/components/commons/CuisineList";
import ProductDetailModal from "@/components/commons/ProductDetailModal";
import ProductList from "@/components/commons/ProductList";
import FilterChips from "@/pages/search/components/FilterChips";
import SortSelect from "@/pages/search/components/SortSelect";
import type { Product } from "@/types/product.types";
import React, { useCallback, useState } from "react";

const Search: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<string>("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const toggleCuisine = useCallback((name: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }, []);

  const clearAll = () => setSelectedCuisines([]);
  const removeFilter = (f: string) =>
    setSelectedCuisines((prev) => prev.filter((c) => c !== f));

  return (
    <main className="flex min-h-screen bg-gray-50">
      {/* left sticky filter list */}
      <CuisineFilter selected={selectedCuisines} onToggle={toggleCuisine} />

      {/* right side */}
      <section className="flex-1 p-10">
        {/* top bar: chips, count, sort */}
        <div className="flex items-center justify-between mb-6">
          <FilterChips
            selected={selectedCuisines}
            onRemove={removeFilter}
            onClear={clearAll}
          />

          <div className="text-sm font-medium">
            {totalCount.toLocaleString()} Items Found
          </div>

          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>

        {/* product grid + infinite scroll */}
        <ProductList
          sortBy={sortBy}
          cuisines={selectedCuisines}
          onSelectProduct={setSelectedProduct}
          onCountChange={setTotalCount}
        />

        {/* detail modal & banner */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </section>
    </main>
  );
};

export default Search;
