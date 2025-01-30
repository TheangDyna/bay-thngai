import { useState } from "react";
import { DeleteDialog, DeleteStatus } from "@/components/DeleteDialog";

interface UseDeleteDialogProps {
  onDelete?: (id: string) => Promise<void>;
}

export const useDeleteDialog = ({ onDelete }: UseDeleteDialogProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<DeleteStatus>("idle");
  const [message, setMessage] = useState(
    "This action cannot be undone. This will permanently delete this item and remove it from our servers."
  );
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const openDialog = ({
    status = "idle",
    message
  }: {
    status?: DeleteStatus;
    message?: string;
  } = {}) => {
    setStatus(status);
    if (message) setMessage(message);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setStatus("idle");
    setMessage("");
    setItemToDelete(null);
  };

  const handleDelete = async () => {
    if (!onDelete || !itemToDelete) return;

    try {
      setStatus("deleting");
      await onDelete(itemToDelete);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage("Failed to delete. Please try again.");
    }
  };

  const DialogComponent = ({ title }: { title?: string }) => (
    <DeleteDialog
      isOpen={isOpen}
      status={status}
      message={message}
      onClose={closeDialog}
      onConfirm={handleDelete}
      title={title}
    />
  );

  return {
    openDialog,
    closeDialog,
    setItemToDelete,
    DialogComponent
  };
};
