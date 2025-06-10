import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { DataTableRowActions } from "@/pages/products/DataTableRowActions";
import { Product } from "@/types/product.types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../components/ui/badge";

export const columns: (
  currentPage: number,
  pageSize: number
) => ColumnDef<Product>[] = (currentPage, pageSize) => [
  {
    id: "index",
    header: () => <span className="max-w-[100px] truncate">N.o</span>,
    cell: ({ row }) => (
      <span className="max-w-[100px] truncate">
        {currentPage * pageSize + row.index + 1}
      </span>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <img
            src={row.original.thumbnail}
            alt={row.original.name}
            className="w-8 h-8 rounded-md"
          />
          <span className="max-w-[500px] truncate">{row.original.name}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate">
          {row.original.price.toFixed(2)}
        </span>
      );
    }
  },
  {
    accessorKey: "cuisines",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cuisines" />
    ),
    cell: ({ row }) => {
      const cuisines = row.original.cuisines || [];
      const maxCount = 1;
      return (
        <div className="flex space-x-2">
          {cuisines.slice(0, maxCount).map((cuisine, index) => (
            <Badge key={index} variant="secondary" className="max-w-[120px]">
              <span className="text-nowrap truncate">{cuisine.name}</span>
            </Badge>
          ))}
          {cuisines.length > maxCount && (
            <Badge variant="secondary">
              <span className="text-nowrap">{`+ ${cuisines.length - maxCount}`}</span>
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: "inStock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="In Stock" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge
            variant="outline"
            className={
              row.original.inStock
                ? "text-green-400 border-green-400"
                : "text-red-400 border-red-400"
            }
          >
            {row.original.inStock ? "Yes" : "No"}
          </Badge>
        </div>
      );
    },
    enableSorting: false
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
