import { useState } from "react";
import { DeleteDialog, DeleteStatus } from "@/components/DeleteDialog";

export const useDeleteDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<DeleteStatus>("idle");
  const [message, setMessage] = useState(
    "This action cannot be undone. This will permanently delete this item and remove it from our servers."
  );
  const [handleDelete, setHandleDelete] = useState<() => Promise<void> | void>(
    () => async () => {}
  );

  const openDialog = ({
    status = "idle",
    message,
    onDelete
  }: {
    status?: DeleteStatus;
    message?: string;
    onDelete: () => Promise<void> | void;
  }) => {
    setIsOpen(true);
    setStatus(status);
    if (message) setMessage(message);
    setHandleDelete(() => onDelete);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setStatus("idle");
    setMessage("");
  };

  const DialogComponent = () => (
    <DeleteDialog
      isOpen={isOpen}
      status={status}
      message={message}
      onClose={closeDialog}
      onConfirm={handleDelete}
    />
  );

  return { openDialog, closeDialog, DialogComponent };
};
