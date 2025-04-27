import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { DataTableRowActions } from "@/pages/cuisines/DataTableRowActions";
import { Cuisine } from "@/types/cuisine.types";

export const columns: (
  currentPage: number,
  pageSize: number
) => ColumnDef<Cuisine>[] = (currentPage, pageSize) => [
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
            src={"/logo.png"}
            alt={row.original.name}
            className="w-8 h-8 rounded-md"
          />
          <span className="max-w-[500px] truncate">{row.original.name}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate">{row.original.name}</span>
      );
    }
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
