import { Badge } from "@/components/ui/badge";
import { Discount } from "@/types/discount.types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTableRowActions } from "./DataTableRowActions";

export const columns: (
  pageIndex: number,
  pageSize: number
) => ColumnDef<Discount>[] = (pageIndex, pageSize) => [
  {
    id: "index",
    header: () => <span>#</span>,
    cell: ({ row }) => <span>{pageIndex * pageSize + row.index + 1}</span>,
    enableSorting: false
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.type === "flat" ? "Flat $" : "Percent %"}
      </Badge>
    )
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span>
        {row.original.type === "percentage"
          ? `${row.original.amount}%`
          : `$${row.original.amount}`}
      </span>
    )
  },
  {
    accessorKey: "startDate",
    header: "Start",
    cell: ({ row }) =>
      format(new Date(row.original.startDate), "yyyy-MM-dd HH:mm:ss")
  },
  {
    accessorKey: "endDate",
    header: "End",
    cell: ({ row }) =>
      format(new Date(row.original.endDate), "yyyy-MM-dd HH:mm:ss")
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.active
            ? "border-green-500 text-green-500"
            : "border-red-500 text-red-500"
        }
      >
        {row.original.active ? "Active" : "Disabled"}
      </Badge>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
