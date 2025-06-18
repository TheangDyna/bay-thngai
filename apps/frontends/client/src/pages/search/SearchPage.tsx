import { ProductDetailModal } from "@/components/commons/ProductDetailModal";
import { CuisineFilter } from "@/pages/search/components/CuisineFilter";
import { ProductList } from "@/pages/search/components/ProductList";
import { SortSelect } from "@/pages/search/components/SortSelect";
import { Cuisine } from "@/types/cuisine.types";
import type { Product } from "@/types/product.types";
import axiosInstance from "@/utils/axiosInstance";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";

const SearchPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState(params.get("sort") || "");
  const [search, setSearch] = useState(params.get("search") || "");
  const [selectedCuisines, setSelectedCuisines] = useState<Cuisine[]>([]);
  const [debouncedSearch] = useDebounce(search, 1000);
  const [totalCount, setTotalCount] = useState(0);

  // Parse and apply sort + top sections
  useEffect(() => {
    const topSelling = params.has("top-selling");
    const topRated = params.has("top-rated");
    const newArrivals = params.has("new-arrivals");

    if (topSelling) setSortBy("most-sold");
    else if (topRated) setSortBy("top-rated");
    else if (newArrivals) setSortBy("newest");
  }, [params]);

  // Load cuisines from query param
  useEffect(() => {
    const queryIds = params.get("cuisines");
    if (!queryIds) return;

    const ids = queryIds.split(",");

    axiosInstance.get("/cuisines").then((res) => {
      const all: Cuisine[] = res.data.data;
      const matched = all.filter((c) => ids.includes(c._id));
      setSelectedCuisines(matched);
    });
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const newParams: any = {};
    if (sortBy) newParams.sort = sortBy;
    if (search) newParams.search = search;
    if (selectedCuisines.length)
      newParams.cuisines = selectedCuisines.map((c) => c._id).join(",");
    setParams(newParams, { replace: true });
  }, [sortBy, search, selectedCuisines, setParams]);

  const toggleCuisine = useCallback((cuisine: Cuisine) => {
    setSelectedCuisines((prev) =>
      prev.find((c) => c._id === cuisine._id)
        ? prev.filter((c) => c._id !== cuisine._id)
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
