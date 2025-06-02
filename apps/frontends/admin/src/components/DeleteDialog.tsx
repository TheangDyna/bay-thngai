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
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteDialog({
  isOpen,
  status,
  title,
  message,
  onClose,
  onConfirm
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
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center flex gap-3">
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
