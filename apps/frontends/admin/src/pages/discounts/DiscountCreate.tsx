import { useCreateDiscountMutation } from "@/api/discount";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useUploadDialog } from "@/hooks/useUploadDialog";
import { DiscountFormFields } from "@/pages/discounts/DiscountFormFields";
import { DiscountInput } from "@/types/discount.types";
import {
  DiscountDefaultValue,
  DiscountSchema
} from "@/validators/discount.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const DiscountCreate: React.FC = () => {
  const { mutation: createDiscountMutation } = useCreateDiscountMutation();
  const uploadDialog = useUploadDialog();

  const form = useForm<DiscountInput>({
    resolver: zodResolver(DiscountSchema),
    defaultValues: DiscountDefaultValue
  });

  const onSubmit = (data: DiscountInput) => {
    uploadDialog.openDialog({
      status: "uploading",
      message: "Creating discount..."
    });

    createDiscountMutation.mutate(data, {
      onSuccess: () => {
        uploadDialog.openDialog({
          status: "success",
          message: "Discount created successfully"
        });
        form.reset();
        setTimeout(uploadDialog.closeDialog, 3000);
      },
      onError: () => {
        uploadDialog.openDialog({
          status: "error",
          message: "Failed to create discount"
        });
        setTimeout(uploadDialog.closeDialog, 5000);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h1 className="text-2xl font-bold">Create Discount</h1>
          <DiscountFormFields form={form} />
          <Button type="submit">Create Discount</Button>
        </form>
      </Form>
      {uploadDialog.DialogComponent({ progress: 0 })}
    </>
  );
};

export default DiscountCreate;
