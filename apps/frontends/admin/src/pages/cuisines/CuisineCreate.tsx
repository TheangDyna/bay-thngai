import { useCreateCuisineMutation } from "@/api/cuisine";
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
import { Textarea } from "@/components/ui/textarea";
import { useUploadDialog } from "@/hooks/useUploadDialog";
import { CuisineInput } from "@/types/cuisine.types";
import {
  cuisineDefaultValues,
  CuisineSchema
} from "@/validators/cuisine.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const CuisineCreate: React.FC = () => {
  const form = useForm<CuisineInput>({
    resolver: zodResolver(CuisineSchema),
    defaultValues: cuisineDefaultValues
  });

  const { mutation: createCuisineMutation, progress } =
    useCreateCuisineMutation();
  const uploadDialog = useUploadDialog();

  const onSubmit = (data: CuisineInput) => {
    uploadDialog.openDialog({
      status: "uploading",
      message: "Creating cuisine..."
    });

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    createCuisineMutation.mutate(formData, {
      onSuccess: () => {
        uploadDialog.openDialog({
          status: "success",
          message: "Cuisine created successfully!"
        });
        form.reset();
        setTimeout(uploadDialog.closeDialog, 3000);
      },
      onError: (error: any) => {
        uploadDialog.openDialog({
          status: "error",
          message:
            "There was an issue creating the cuisine. Please check the form for errors."
        });
        // duplicate‐value handling as before
        const serverMessage = error.response?.data?.message || "";
        if (serverMessage.includes("Duplicate value")) {
          const match = serverMessage.match(/Duplicate value "(.*?)"/);
          const duplicateValue = match ? match[1] : "value";
          const fieldMatch = serverMessage.match(/field "(.*?)"/);
          const fieldName = fieldMatch ? fieldMatch[1] : "field";
          form.setError(fieldName as any, {
            type: "server",
            message: `The ${fieldName} "${duplicateValue}" is already in use.`
          });
        }
        setTimeout(uploadDialog.closeDialog, 5000);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Create Cuisine</h1>
              </div>
            </div>
            {/* Submit screen lg */}
            <Button type="submit" className="hidden md:inline-flex">
              Create Product
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-6">
            <div className="lg:col-span-3 space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisine Name</FormLabel>
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
                      <Textarea
                        {...field}
                        placeholder="Description"
                        rows={5}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

          {/* Submit screen sm */}
          <Button type="submit" className="md:hidden">
            Create Product
          </Button>
        </form>
      </Form>

      {uploadDialog.DialogComponent({ progress })}
    </>
  );
};

export default CuisineCreate;
