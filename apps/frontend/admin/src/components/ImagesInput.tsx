import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/utils/cn";
import { Button } from "./ui/button";

interface ImagesPreview {
  url: string;
  file?: File;
}

interface ImagesInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  maxSize?: number;
  maxFiles?: number;
  accept?: string;
  className?: string;
}

export const ImagesInput = forwardRef<HTMLInputElement, ImagesInputProps<any>>(
  (
    {
      name,
      control,
      maxSize = 5,
      maxFiles = 5,
      accept = "image/*",
      className,
      ...props
    },
    ref
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const {
      field: { onChange, value = [] },
      fieldState: { error }
    } = useController({
      name,
      control
    });

    const [previews, setPreviews] = useState<ImagesPreview[]>([]);

    // Sync previews with initial value (supports File and URL)
    useEffect(() => {
      const initialPreviews = (value as (File | string)[]).map((item) =>
        item instanceof File
          ? { url: URL.createObjectURL(item), file: item }
          : { url: item }
      );
      setPreviews(initialPreviews);

      // Cleanup URLs for File previews
      return () => {
        initialPreviews
          .filter((preview) => preview.file)
          .forEach((preview) => URL.revokeObjectURL(preview.url));
      };
    }, [value]);

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

    const handleFiles = (files: File[]) => {
      if (files.length === 0) return;

      if (previews.length + files.length > maxFiles) {
        toast({
          description: `Maximum ${maxFiles} files allowed`,
          variant: "destructive"
        });
        return;
      }

      const validFiles = files.filter(validateFile);
      if (validFiles.length === 0) return;

      const newPreviews = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file
      }));

      setPreviews((prev) => [...prev, ...newPreviews]);
      onChange([...(value || []), ...validFiles]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;
      handleFiles(Array.from(files));
      e.target.value = ""; // Reset input
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      handleFiles(files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const removeImage = (index: number) => {
      setPreviews((prev) => {
        const newPreviews = [...prev];
        if (newPreviews[index].file) {
          URL.revokeObjectURL(newPreviews[index].url);
        }
        newPreviews.splice(index, 1);
        return newPreviews;
      });

      const newValue = [...(value || [])];
      newValue.splice(index, 1);
      onChange(newValue);
    };

    const showUploadButton = previews.length < maxFiles;

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={preview.url} className="relative group aspect-square">
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-md shadow-sm"
                />
                <div className="absolute inset-0 transition-all rounded-md">
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 opacity-0 rounded-full group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {showUploadButton && (
              <label
                htmlFor="images"
                className={cn(
                  "border-2 border-dashed rounded-md aspect-square",
                  "text-muted-foreground text-sm leading-loose",
                  "flex flex-col items-center justify-center cursor-pointer",
                  "transition-colors bg-secondary/20",
                  previews.length === 0 &&
                    "col-span-full row-span-full aspect-[3/1]"
                )}
              >
                <input
                  {...props}
                  type="file"
                  accept={accept}
                  multiple={true}
                  className="hidden"
                  id="images"
                  onChange={handleFileChange}
                  ref={ref || fileInputRef}
                />
                <Upload className="mb-3 w-8 h-8" />
                {previews.length === 0 ? (
                  <>
                    <p className="text-center text-base">
                      Drag and drop your photos here, or{" "}
                      <span className="hover:underline">browse</span>
                    </p>
                    <p>Supports: JPG, PNG, GIF (Max {maxSize}MB)</p>
                    <p>Up to {maxFiles} files</p>
                  </>
                ) : (
                  <p>Add more</p>
                )}
              </label>
            )}
          </div>
        </div>

        {previews.length > 0 && !error && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            {previews.length} {previews.length === 1 ? "photo" : "photos"}{" "}
            selected
          </p>
        )}
      </div>
    );
  }
);

ImagesInput.displayName = "ImagesInput";
