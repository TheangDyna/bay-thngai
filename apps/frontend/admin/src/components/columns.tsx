import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { DataTableRowActions } from "@/components/DataTableRowActions";
import { z } from "zod";
import { Badge } from "./ui/badge";

export const productSchema = z.object({
  name: z.string(),
  price: z.number(),
  cuisines: z.array(z.object({ name: z.string() })),
  inStock: z.boolean()
});

export type Product = z.infer<typeof productSchema>;

export const columns: ColumnDef<Product>[] = [
  {
    id: "index",
    header: () => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">N.o</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.index + 1}
        </span>
      </div>
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
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
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
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("price")}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "cuisines",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cuisines" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("cuisines")?.map((cuisine, index) => (
              <Badge variant="outline" key={index}>
                {cuisine.name}
              </Badge>
            ))}
          </span>
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
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("inStock") ? (
              <Badge
                variant="outline"
                className="text-green-400 border-green-400"
              >
                Yes
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-400 border-red-400">
                No
              </Badge>
            )}
          </span>
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
