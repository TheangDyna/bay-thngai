import { useState } from "react";
import { UploadDialog, UploadStatus } from "@/components/UploadDialog";

export const useUploadDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("Processing your request...");

  const openDialog = ({
    status,
    message = "Processing your request..."
  }: {
    status: UploadStatus;
    progress?: number;
    message?: string;
  }) => {
    setStatus(status);
    setMessage(message);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setStatus("idle");
    setMessage("");
  };

  const DialogComponent = ({ progress = 0 }: { progress: number }) => (
    <UploadDialog
      isOpen={isOpen}
      status={status}
      progress={progress}
      message={message}
      onClose={closeDialog}
    />
  );

  return { openDialog, closeDialog, DialogComponent };
};
