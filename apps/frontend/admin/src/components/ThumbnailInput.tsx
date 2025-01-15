import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/utils/cn";
import { Button } from "./ui/button";

interface FilePreview {
  url: string;
  file?: File; // Optional because it can be a URL string
}

interface ThumbnailInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  maxSize?: number;
  accept?: string;
  className?: string;
  value?: File | string | null; // Allow both File and URL as the initial value
}

export const ThumbnailInput = forwardRef<
  HTMLInputElement,
  ThumbnailInputProps<any>
>(
  (
    {
      name,
      control,
      maxSize = 5,
      accept = "image/*",
      className,
      value,
      ...props
    },
    ref
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const {
      field: { onChange, value: fieldValue }
    } = useController({
      name,
      control
    });

    const [preview, setPreview] = useState<FilePreview | null>(null);

    useEffect(() => {
      // Handle both File and URL types
      const handleValue = value || fieldValue;
      if (handleValue instanceof File) {
        const newPreview = {
          url: URL.createObjectURL(handleValue),
          file: handleValue
        };
        setPreview(newPreview);
      } else if (typeof handleValue === "string") {
        setPreview({ url: handleValue });
      } else {
        setPreview(null);
      }

      // Cleanup object URLs when component is unmounted or value changes
      return () => {
        if (preview?.file && preview.url.startsWith("blob:")) {
          URL.revokeObjectURL(preview.url);
        }
      };
    }, [value, fieldValue]); // Re-run when value or fieldValue changes

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
      if (!file || !validateFile(file)) return;

      const newPreview = {
        url: URL.createObjectURL(file),
        file
      };

      setPreview(newPreview);
      onChange(file); // Update `react-hook-form` state
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      handleFile(file);
      e.target.value = ""; // Clear input value
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
      setPreview(null);
      onChange(null); // Reset the field value in `react-hook-form`
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
                alt="Preview Thumbnail"
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
              htmlFor="thumbnail"
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
                id="thumbnail"
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
