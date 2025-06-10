import { useCuisineQuery, useUpdateCuisineMutation } from "@/api/cuisine";
import { ThumbnailInput } from "@/components/ThumbnailInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useUploadDialog } from "@/hooks/useUploadDialog";
import Error from "@/pages/Error";
import { CuisineInput } from "@/types/cuisine.types";
import {
  cuisineDefaultValues,
  CuisineSchema
} from "@/validators/cuisine.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

const CuisineEdit: React.FC = () => {
  const { cuisineId } = useParams<{ cuisineId: string }>();
  const { data: cuisineResp, isLoading, isError } = useCuisineQuery(cuisineId!);
  const { mutation: updateCuisine, progress } = useUpdateCuisineMutation(
    cuisineId!
  );
  const uploadDialog = useUploadDialog();

  const form = useForm<CuisineInput & { thumbnail?: File | string }>({
    resolver: zodResolver(
      CuisineSchema.extend({ thumbnail: z.any().optional() })
    ),
    defaultValues: { ...cuisineDefaultValues, thumbnail: undefined }
  });

  useEffect(() => {
    if (cuisineResp?.data) {
      const { name, description, thumbnail } = cuisineResp.data;
      form.reset({ name, description, thumbnail: thumbnail });
    }
  }, [cuisineResp?.data, form]);

  if (isError) return <Error />;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-6">
          <div className="lg:col-span-3 space-y-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="lg:col-span-2 space-y-5">
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = (data: CuisineInput & { thumbnail?: string | File }) => {
    uploadDialog.openDialog({
      status: "uploading",
      message: "Updating cuisine…"
    });

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    if (data.thumbnail && data.thumbnail instanceof File) {
      formData.append("thumbnail", data.thumbnail);
    }

    updateCuisine.mutate(formData, {
      onSuccess: () => {
        uploadDialog.openDialog({
          status: "success",
          message: "Cuisine updated!"
        });
        setTimeout(uploadDialog.closeDialog, 3000);
      },
      onError: (err: any) => {
        uploadDialog.openDialog({
          status: "error",
          message: "Failed to update cuisine."
        });
        const msg = err.response?.data?.message || "";
        if (msg.includes("Duplicate value")) {
          const match = msg.match(/Duplicate value "(.*?)"/);
          const dup = match?.[1] ?? "";
          form.setError("name", {
            type: "server",
            message: `Name "${dup}" is already taken.`
          });
        }
        setTimeout(uploadDialog.closeDialog, 5000);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Edit Cuisine</h1>
            <Button type="submit" className="hidden md:inline-flex">
              Update Cuisine
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-6">
            {/* Left fields */}
            <div className="lg:col-span-3 space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Cuisine Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Description" rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right fields */}
            <div className="lg:col-span-2 space-y-3">
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <ThumbnailInput
                        control={form.control}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit (sm) */}
          <Button type="submit" className="md:hidden w-full">
            Update Cuisine
          </Button>
        </form>
      </Form>

      {uploadDialog.DialogComponent({ progress })}
    </>
  );
};

export default CuisineEdit;
