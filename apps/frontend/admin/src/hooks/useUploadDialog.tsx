import { useState } from "react";
import { UploadDialog, UploadStatus } from "@/components/UploadDialog";

export const useUploadDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [title, setTitle] = useState("Processing your request");
  const [message, setMessage] = useState("Processing your request...");

  const getTitleByStatus = (status: UploadStatus) => {
    switch (status) {
      case "idle":
        return "Processing your request";
      case "uploading":
        return "Uploading...";
      case "success":
        return "Success";
      case "error":
        return "Error";
      default:
        return "Processing your request";
    }
  };

  const getMessageByStatus = (status: UploadStatus) => {
    switch (status) {
      case "idle":
        return "Processing your request...";
      case "uploading":
        return "Please wait while we process your request.";
      case "success":
        return "Your request has been successfully processed.";
      case "error":
        return "An error occurred while processing. Please try again.";
      default:
        return "Processing your request...";
    }
  };

  const openDialog = ({
    status = "idle",
    title: customTitle,
    message: customMessage
  }: {
    status?: UploadStatus;
    title?: string;
    message?: string;
  }) => {
    setIsOpen(true);
    setStatus(status);
    setTitle(customTitle || getTitleByStatus(status));
    setMessage(customMessage || getMessageByStatus(status));
  };

  const closeDialog = () => {
    setIsOpen(false);
    setStatus("idle");
    setTitle("Processing your request");
    setMessage("Processing your request...");
  };

  const DialogComponent = ({ progress = 0 }: { progress: number }) => (
    <UploadDialog
      isOpen={isOpen}
      status={status}
      title={title}
      progress={progress}
      message={message}
      onClose={closeDialog}
    />
  );

  return { openDialog, closeDialog, DialogComponent };
};
