import { ProductDetailModal } from "@/components/commons/ProductDetailModal";
import { CuisineFilter } from "@/pages/search/components/CuisineFilter";
import { ProductList } from "@/pages/search/components/ProductList";
import { SortSelect } from "@/pages/search/components/SortSelect";
import { Cuisine } from "@/types/cuisine.types";
import type { Product } from "@/types/product.types";
import React, { useCallback, useState } from "react";
import { useDebounce } from "use-debounce";

const SearchPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<Cuisine[]>([]);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [debouncedSearch] = useDebounce(search, 1000);

  const toggleCuisine = useCallback((cuisine: Cuisine) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  }, []);

  const clearAll = useCallback(() => {
    setSelectedCuisines([]);
  }, []);

  const removeFilter = useCallback((id: string) => {
    setSelectedCuisines((prev) => prev.filter((c) => c._id !== id));
  }, []);

  return (
    <main className="flex min-h-screen">
      <CuisineFilter
        selected={selectedCuisines}
        onToggle={toggleCuisine}
        onClear={clearAll}
        onRemove={removeFilter}
        search={search}
        onSearch={setSearch}
      />
      <section className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">
            {totalCount.toLocaleString()} items found
          </span>

          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>

        <ProductList
          sortBy={sortBy}
          cuisines={selectedCuisines}
          search={debouncedSearch}
          onSelectProduct={setSelectedProduct}
          onCountChange={setTotalCount}
        />

        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </section>
    </main>
  );
};

export default SearchPage;
