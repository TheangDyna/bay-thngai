import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DataTableRowActions } from "@/pages/order/DataTableRowActions";
import { Order } from "@/types/order.types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: (
  currentPage: number,
  pageSize: number,
  onUpdateDeliveryStatus: (
    orderId: string,
    status: Order["deliveryStatus"]
  ) => void
) => ColumnDef<Order>[] = (currentPage, pageSize, onUpdateDeliveryStatus) => [
  {
    id: "index",
    header: () => <span className="max-w-[100px] truncate">No.</span>,
    cell: ({ row }) => (
      <span className="max-w-[100px] truncate">
        {currentPage * pageSize + row.index + 1}
      </span>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "tranId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction ID" />
    ),
    cell: ({ row }) => <span className="truncate">{row.original.tranId}</span>
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      const { firstName, lastName, phone } = row.original.customer;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {firstName} {lastName}
          </span>
          <span className="text-muted-foreground text-sm">{phone}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => <span>${row.original.amount.toFixed(2)}</span>
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.paymentMethod}
      </Badge>
    )
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      const color =
        status === "approved"
          ? "green"
          : status === "pending"
            ? "yellow"
            : "red";
      return (
        <Badge
          variant="outline"
          className={`border-${color}-400 text-${color}-400 capitalize`}
        >
          {status}
        </Badge>
      );
    }
  },
  {
    id: "deliveryStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Delivery Status" />
    ),
    cell: ({ row }) => {
      const current = row.original.deliveryStatus;
      return (
        <Select
          value={current}
          onValueChange={(val) =>
            onUpdateDeliveryStatus(
              row.original._id,
              val as Order["deliveryStatus"]
            )
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Set status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleString()}</span>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
