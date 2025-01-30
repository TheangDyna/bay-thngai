import { EllipsisVertical } from "lucide-react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useDeleteDialog } from "@/hooks/useDeleteDialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends { _id: string }>({
  row
}: DataTableRowActionsProps<TData>) {
  const navigate = useNavigate();
  const deleteDialog = useDeleteDialog();

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/products/${row.original._id}/edit`);
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteDialog.openDialog();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <EllipsisVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDeleteClick}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {deleteDialog.DialogComponent({})}
    </>
  );
}
