import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import React from "react";

import { useDeleteProductMutation } from "@/api/product";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useDeleteDialog } from "@/hooks/useDeleteDialog";
import { useNavigate } from "react-router-dom";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends { _id: string }>({
  row
}: DataTableRowActionsProps<TData>) {
  const navigate = useNavigate();
  const deleteDialog = useDeleteDialog();

  const deleteProductMutation = useDeleteProductMutation(row.original._id);

  const handleReturnClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Perform ");
  };

  const handleDelete = () => {
    deleteDialog.openDialog({
      status: "deleting"
    });
    deleteProductMutation.mutate(undefined, {
      onSuccess: () => {
        deleteDialog.openDialog({
          status: "success"
        });
        setTimeout(deleteDialog.closeDialog, 3000);
      },
      onError: () => {
        deleteDialog.openDialog({
          status: "error",
          onDelete: handleDelete
        });
        setTimeout(deleteDialog.closeDialog, 5000);
      }
    });
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
          <DropdownMenuItem onClick={handleReturnClick}>
            Return
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleReturnClick}>
            Return
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      {deleteDialog.DialogComponent()}
    </>
  );
}
