import { ArrowDownIcon, ArrowUpIcon, ArrowUpDown } from "lucide-react";
import { Column } from "@tanstack/react-table";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const handleClick = () => {
    if (column.getIsSorted() === "asc") {
      column.toggleSorting(true); // Set to desc
    } else if (column.getIsSorted() === "desc") {
      column.clearSorting(); // Set to default (no sorting)
    } else {
      column.toggleSorting(false); // Set to asc
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent group"
        onClick={handleClick}
      >
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          <ArrowDownIcon className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUpIcon className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100" />
        )}
      </Button>
    </div>
  );
}
