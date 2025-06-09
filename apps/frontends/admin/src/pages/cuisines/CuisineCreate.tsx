import { useCreateCuisineMutation } from "@/api/cuisine";
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

  function onSubmit(data: CuisineInput) {
    uploadDialog.openDialog({
      status: "uploading",
      message: "Creating cuisine..."
    });
    createCuisineMutation.mutate(data, {
      onSuccess: () => {
        uploadDialog.openDialog({
          status: "success",
          message: "Product created successfully!"
        });
        form.reset();
        setTimeout(uploadDialog.closeDialog, 3000);
      },
      onError: (error: any) => {
        uploadDialog.openDialog({
          status: "error",
          message:
            "There was an issue creating the product. Please check the form for errors."
        });

        const serverMessage = error.response?.data?.message || "";
        if (serverMessage.includes("Duplicate value")) {
          const match = serverMessage.match(/Duplicate value "(.*?)"/);
          const duplicateValue = match ? match[1] : "value";
          const fieldMatch = serverMessage.match(/field "(.*?)"/);
          const fieldName = fieldMatch ? fieldMatch[1] : "field";

          if (fieldName) {
            form.setError(fieldName as keyof CuisineInput, {
              type: "server",
              message: `The ${fieldName} "${duplicateValue}" is already in use. Please choose a different ${fieldName}.`
            });
          }
        }
        setTimeout(uploadDialog.closeDialog, 5000);
      }
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-6">
            <div className="lg:col-span-3 space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisine Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="cuisine"
                        placeholder="Cuisine Name"
                        {...field}
                      />
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
                        autoComplete="description"
                        placeholder="Description"
                        className="resize-none"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit">Create</Button>
        </form>
      </Form>
      {uploadDialog.DialogComponent({ progress })}
    </>
  );
};

export default CuisineCreate;
