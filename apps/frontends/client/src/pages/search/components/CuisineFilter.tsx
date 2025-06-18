import { useCuisinesQuery } from "@/api/cuisine";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterChips } from "@/pages/search/components/FilterChips";
import type { Cuisine } from "@/types/cuisine.types";
import { Loader2, X } from "lucide-react"; // <-- import X
import React from "react";

export interface CuisineFilterProps {
  selected: Cuisine[];
  onToggle: (cuisine: Cuisine) => void;
  onClear: () => void;
  onRemove: (cuisine: string) => void;
  search: string;
  onSearch: (value: string) => void;
}

export const CuisineFilter: React.FC<CuisineFilterProps> = ({
  selected,
  onToggle,
  onClear,
  onRemove,
  search,
  onSearch
}) => {
  const {
    data: cuisines,
    isLoading,
    isError
  } = useCuisinesQuery({
    sorting: [],
    columnFilters: []
  });

  const container =
    "w-[320px] h-[calc(100vh-80px)] sticky top-20 bg-background p-6 border-r";

  if (isLoading) {
    return (
      <aside className={container}>
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      </aside>
    );
  }

  if (isError || !cuisines) {
    return (
      <aside className={container}>
        <p className="text-red-600 text-center">Failed to load filters.</p>
      </aside>
    );
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    cuisine: Cuisine
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle(cuisine);
    }
  };

  return (
    <aside className={container}>
      <div className="h-full flex flex-col space-y-6">
        {/* Search */}
        <div className="space-y-1">
          <Label htmlFor="product-search">Search Products</Label>
          <div className="relative">
            <Input
              id="product-search"
              placeholder="Type to search..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearch("")}
                className="absolute inset-y-0 right-2 flex items-center justify-center p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Active filters */}
        {selected.length > 0 && (
          <div className="space-y-1">
            <FilterChips
              selected={selected}
              onRemove={onRemove}
              onClear={onClear}
            />
          </div>
        )}

        {/* Cuisine list */}
        <div className="flex-1 flex flex-col space-y-2 min-h-0">
          <Label>Filter by Cuisine</Label>
          <ScrollArea className="flex-1">
            <ul className="space-y-1">
              {cuisines.data.map((c) => {
                const active = selected.some((sel) => sel._id === c._id);
                return (
                  <li
                    key={c._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onToggle(c)}
                    onKeyDown={(e) => handleKeyDown(e, c)}
                    className={`flex items-center p-2 text-sm rounded-md cursor-pointer transition-colors ${
                      active ? "bg-primary/10" : "hover:bg-primary/10"
                    }`}
                  >
                    <div className="w-6 h-6 bg-muted mr-2">
                      <img
                        src={c.thumbnail}
                        alt={c.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="capitalize">{c.name}</span>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </div>
      </div>
    </aside>
  );
};
