import React, { forwardRef, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/utils/cn";
import { Button } from "./ui/button";

interface FilePreview {
  url: string;
  file: File;
}

interface ThumbnailInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  maxSize?: number;
  accept?: string;
  className?: string;
}

export const ThumbnailInput = forwardRef<
  HTMLInputElement,
  ThumbnailInputProps<any>
>(
  (
    { name, control, maxSize = 5, accept = "image/*", className, ...props },
    ref
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const {
      field: { onChange },
      fieldState: { error }
    } = useController({
      name,
      control
    });

    const [preview, setPreview] = useState<FilePreview | null>(null);

    const validateFile = (file: File): boolean => {
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          description: `File size should not exceed ${maxSize}MB`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    };

    const handleFile = (file: File) => {
      if (!file) return;

      if (!validateFile(file)) return;

      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }

      const newPreview = {
        url: URL.createObjectURL(file),
        file
      };

      setPreview(newPreview);
      onChange(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      handleFile(file);
      e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = Array.from(e.dataTransfer.files).find((file) =>
        file.type.startsWith("image/")
      );
      if (file) handleFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const removeFile = () => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
      setPreview(null);
      onChange(null);
    };

    return (
      <div className={cn("w-full", className)}>
        <div
          className={cn(
            "relative rounded-md border border-input bg-background p-3",
            isDragging &&
              "ring-offset-background ring-2 ring-ring ring-offset-2"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="relative group aspect-square">
              <img
                src={preview.url}
                alt="Preview Thubmail"
                className="w-full h-full object-cover rounded-md shadow-sm"
              />
              <div className="absolute inset-0 transition-all rounded-md">
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={removeFile}
                  className="absolute top-1 right-1 opacity-0 rounded-full group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="thubmail-upload"
              className={cn(
                "border-2 border-dashed rounded-md",
                "text-muted-foreground text-sm leading-loose",
                "flex flex-col items-center justify-center cursor-pointer",
                "transition-colors hover:bg-accent/50 aspect-[3/1]",
                "bg-accent/20"
              )}
            >
              <input
                {...props}
                type="file"
                accept={accept}
                className="hidden"
                id="thubmail-upload"
                onChange={handleFileChange}
                ref={ref || fileInputRef}
              />
              <Upload className="mb-3 w-8 h-8" />
              <p className="text-center text-base font-medium">
                Drag and drop your file here, or{" "}
                <span className="hover:underline">browse</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Supports: JPG, PNG, GIF (Max {maxSize}MB)
              </p>
            </label>
          )}
        </div>
      </div>
    );
  }
);

ThumbnailInput.displayName = "ThumbnailInput";
