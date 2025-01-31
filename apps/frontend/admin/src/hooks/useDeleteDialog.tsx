import { useState } from "react";
import { DeleteDialog, DeleteStatus } from "@/components/DeleteDialog";

export const useDeleteDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<DeleteStatus>("idle");
  const [title, setTitle] = useState("Are you absolutely sure?");
  const [message, setMessage] = useState(
    "This action cannot be undone. This will permanently delete this item and remove it from our servers."
  );
  const [handleDelete, setHandleDelete] = useState<() => Promise<void> | void>(
    () => async () => {}
  );

  const getTitleByStatus = (status: DeleteStatus) => {
    switch (status) {
      case "idle":
        return "Are you absolutely sure?";
      case "deleting":
        return "Deleting...";
      case "success":
        return "Success";
      case "error":
        return "Error";
      default:
        return "Are you absolutely sure?";
    }
  };

  const getMessageByStatus = (status: DeleteStatus) => {
    switch (status) {
      case "idle":
        return "This action cannot be undone. This will permanently delete this item and remove it from our servers.";
      case "deleting":
        return "Please wait while we process your request.";
      case "success":
        return "The item has been successfully deleted.";
      case "error":
        return "An error occurred while deleting. Please try again.";
      default:
        return "This action cannot be undone. This will permanently delete this item and remove it from our servers.";
    }
  };

  const openDialog = ({
    status = "idle",
    title: customTitle,
    message: customMessage,
    onDelete
  }: {
    status?: DeleteStatus;
    title?: string;
    message?: string;
    onDelete?: () => Promise<void> | void;
  }) => {
    setIsOpen(true);
    setStatus(status);

    setTitle(customTitle || getTitleByStatus(status));
    setMessage(customMessage || getMessageByStatus(status));

    if (onDelete) setHandleDelete(() => onDelete);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setStatus("idle");
    setTitle("Are you absolutely sure?");
    setMessage(
      "This action cannot be undone. This will permanently delete this item and remove it from our servers."
    );
  };

  const DialogComponent = () => (
    <DeleteDialog
      isOpen={isOpen}
      status={status}
      title={title}
      message={message}
      onClose={closeDialog}
      onConfirm={handleDelete}
    />
  );

  return { openDialog, closeDialog, DialogComponent };
};
