import { Loader2, Upload, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadDialogProps {
  isOpen: boolean;
  status: UploadStatus;
  progress?: number;
  message?: string;
  onClose?: () => void;
}

export const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  status,
  progress = 0,
  message = "Processing your request...",
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center gap-4">
            {/* Status Icons */}
            {status === "uploading" && (
              <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <Upload className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            )}
            {status === "success" && (
              <CheckCircle className="w-12 h-12 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* Message */}
          <p className="text-center font-medium">{message}</p>

          {/* Progress Bar */}
          {status === "uploading" && (
            <>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {progress}% Complete
              </p>
            </>
          )}
        </div>

        {/* Footer with close button for success/error states */}
        {(status === "success" || status === "error") && (
          <DialogFooter className="sm:justify-center">
            {/* className="inline-flex items-center justify-center px-4 py-2
            rounded-md text-sm font-medium transition-colors" */}
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
