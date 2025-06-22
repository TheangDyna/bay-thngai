import { useCuisinesQuery } from "@/api/cuisine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ProductFacetedFilter } from "@/pages/discounts/apply/ProductFacetedFilter";
import { Product } from "@/types/product.types";
import axiosInstance from "@/utils/axiosInstance";
import { cn } from "@/utils/cn";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "use-debounce";

interface Props {
  selected: string[];
  onChange: (ids: string[]) => void;
}

const SORT_OPTIONS = [
  { value: "highest-price", label: "Highest Price" },
  { value: "lowest-price", label: "Lowest Price" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "top-rated", label: "Top Rated" },
  { value: "most-sold", label: "Best Seller" }
];

const SORT_MAP: Record<string, string> = {
  "lowest-price": "price",
  "highest-price": "-price",
  newest: "-createdAt",
  oldest: "createdAt",
  "top-rated": "-ratingsAverage",
  "most-sold": "-sold"
};

const ITEMS_PER_PAGE = 20;

export const ProductSelector: React.FC<Props> = ({ selected, onChange }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCuisineIds, setSelectedCuisineIds] = useState<string[]>([]);

  const { ref, inView } = useInView({ threshold: 0 });
  const { data: cuisinesData } = useCuisinesQuery({});

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery<{ data: Product[]; total: number }, Error>({
      queryKey: ["products", sortBy, selectedCuisineIds, debouncedSearch],
      queryFn: async ({ pageParam = 1 }) => {
        const params: Record<string, any> = {
          page: pageParam,
          limit: ITEMS_PER_PAGE,
          select:
            "name,price,inStock,cuisines,thumbnail,ratingsAverage,ratingsQuantity,sold,discount"
        };

        const sortParam = SORT_MAP[sortBy];
        if (sortParam) params.sort = sortParam;
        if (selectedCuisineIds.length) params.cuisines = selectedCuisineIds;
        if (debouncedSearch) params.search = debouncedSearch;

        const res = await axiosInstance.get("/products", { params });
        return res.data;
      },
      getNextPageParam: (last, pages) =>
        pages.length * ITEMS_PER_PAGE < last.total
          ? pages.length + 1
          : undefined,
      initialPageParam: 1
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  const allProducts = data?.pages.flatMap((pg) => pg.data) ?? [];

  const toggleProduct = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((i) => i !== id)
        : [...selected, id]
    );
  };

  const getDiscountBadge = (p: Product) => {
    const d = p.discount;
    if (!d) return null;
    const now = new Date();
    const end = new Date(d.endDate);
    if (!d.active) {
      return (
        <Badge
          variant="outline"
          className=" text-xs border-gray-400 text-gray-400"
        >
          Inactive Discount
        </Badge>
      );
    }
    if (end < now) {
      return (
        <Badge
          variant="outline"
          className=" text-xs border-orange-500 text-orange-500"
        >
          Expired Discount
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className=" text-xs border-green-500 text-green-500"
      >
        Active Discount
      </Badge>
    );
  };

  const toggleAllProducts = () => {
    if (selected.length === allProducts.length) {
      onChange([]); // Unselect all
    } else {
      onChange(allProducts.map((p) => p._id)); // Select all
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap justify-between">
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-[300px]"
          />

          <ProductFacetedFilter
            title="Cuisines"
            value={selectedCuisineIds}
            onChange={setSelectedCuisineIds}
            options={
              cuisinesData?.data.map((c) => ({
                label: c.name,
                value: c._id
              })) ?? []
            }
          />
          {/* Add Select All/Unselect All button */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAllProducts}
            className="h-8"
          >
            {selected.length === allProducts.length
              ? "Unselect All"
              : "Select All"}
          </Button>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-8 w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product List */}
      <div className="h-full border rounded-md p-2">
        {isFetching && !data ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          allProducts.map((p) => (
            <div
              key={p._id}
              className={cn(
                "flex items-start gap-4 py-3 border-b last:border-none cursor-pointer hover:bg-muted transition px-2"
              )}
              onClick={() => toggleProduct(p._id)}
            >
              <Checkbox
                className="mt-1"
                checked={selected.includes(p._id)}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={() => toggleProduct(p._id)}
              />
              {p.thumbnail && (
                <img
                  src={p.thumbnail}
                  alt={p.name}
                  className="w-10 h-10 rounded-md object-cover border"
                />
              )}
              <div className="flex-1 space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{p.name}</p>
                  <span className="text-muted-foreground text-xs">
                    ${p.price}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
                  <span>{p.inStock ? "In Stock" : "Out of Stock"}</span>
                  <span>{p.sold} sold</span>
                  <span className="flex items-center gap-1">
                    <Star
                      className="w-3 h-3 text-yellow-500"
                      fill="currentColor"
                    />
                    {p.ratingsAverage?.toFixed(1) || "0.0"} (
                    {p.ratingsQuantity || "0"})
                  </span>
                </div>
                <div className="flex gap-1 flex-wrap pt-1">
                  {p.cuisines?.map((c) => (
                    <Badge key={c._id} variant="outline" className="text-xs">
                      {c.name}
                    </Badge>
                  ))}
                </div>
              </div>
              {getDiscountBadge(p)}
            </div>
          ))
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={ref} className="h-6" />
        {isFetchingNextPage && (
          <div className="text-center text-sm text-muted-foreground pb-4">
            Loading more products...
          </div>
        )}
        {!hasNextPage && !isFetching && (
          <div className="text-center text-sm text-muted-foreground pb-4">
            — End of results —
          </div>
        )}
      </div>
    </div>
  );
};
