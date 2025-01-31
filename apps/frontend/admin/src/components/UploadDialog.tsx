import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadDialogProps {
  isOpen: boolean;
  status: UploadStatus;
  progress?: number;
  message?: string;
  onClose?: () => void;
  title?: string;
}

export const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  status,
  progress = 0,
  message = "Processing your request...",
  onClose,
  title = "Processing your request"
}) => {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-col items-center gap-4">
            {status === "uploading" && (
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
              : status === "uploading"
                ? "Uploading..."
                : status === "success"
                  ? "Success"
                  : "Error"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {status === "uploading" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-full bg-input rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {progress}% Complete
            </p>
          </div>
        )}
        {(status === "success" || status === "error") && (
          <AlertDialogFooter className="sm:justify-center">
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
