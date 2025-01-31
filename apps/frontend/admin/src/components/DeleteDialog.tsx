import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Trash2 } from "lucide-react";

export type DeleteStatus = "idle" | "deleting" | "error" | "success";

interface DeleteDialogProps {
  isOpen: boolean;
  status: DeleteStatus;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

export function DeleteDialog({
  isOpen,
  status,
  message = "This action cannot be undone. This will permanently delete this item and remove it from our servers.",
  onClose,
  onConfirm,
  title = "Are you absolutely sure?"
}: DeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-col items-center gap-4">
            {status === "idle" && <Trash2 className="w-12 h-12 text-red-400" />}
            {status === "deleting" && (
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="w-12 h-12 text-green-400" />
            )}
            {status === "error" && (
              <XCircle className="w-12 h-12 text-red-400" />
            )}
            {status === "idle"
              ? title
              : status === "deleting"
                ? "Deleting..."
                : status === "success"
                  ? "Success"
                  : "Error"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {status === "idle"
              ? message
              : status === "deleting"
                ? "Please wait while we process your request."
                : status === "success"
                  ? "The item has been successfully deleted."
                  : "An error occurred while deleting. Please try again."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center">
          {status === "idle" && (
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button onClick={onConfirm} variant="destructive">
                Delete
              </Button>
            </>
          )}
          {status === "error" && (
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button onClick={onConfirm} variant="destructive">
                Try Again
              </Button>
            </>
          )}
          {status === "success" && (
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
