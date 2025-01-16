import { X } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableViewOptions } from "@/components/DataTableViewOptions";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { useCuisinesQuery } from "@/api/cuisine.api";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const cuisinesQuery = useCuisinesQuery();

  const cuisineOptions =
    cuisinesQuery.data?.data.map((el) => {
      return {
        label: el.name,
        value: el._id
      };
    }) || [];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          id="search-product"
          placeholder="Search products..."
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("inStock") && (
          <DataTableFacetedFilter
            column={table.getColumn("inStock")}
            title="In Stock"
            options={[
              { label: "Yes", value: "true" },
              { label: "No", value: "false" }
            ]}
          />
        )}
        {table.getColumn("cuisines") && (
          <DataTableFacetedFilter
            column={table.getColumn("cuisines")}
            title="Cuisines"
            options={cuisineOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
