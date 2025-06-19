import { useDiscountQuery, useUpdateDiscountMutation } from "@/api/discount";
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
import { format } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const DiscountEdit: React.FC = () => {
  const { discountId } = useParams<{ discountId: string }>();
  const { data, isLoading, isError } = useDiscountQuery(discountId!);
  const { mutation: update } = useUpdateDiscountMutation(discountId!);
  const uploadDialog = useUploadDialog();

  const form = useForm<DiscountInput>({
    resolver: zodResolver(DiscountSchema),
    defaultValues: DiscountDefaultValue
  });

  useEffect(() => {
    if (data?.data) {
      const { name, type, amount, startDate, endDate, active } = data.data;

      form.reset({
        name,
        type,
        amount,
        active,
        startDate: format(new Date(startDate), "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(new Date(endDate), "yyyy-MM-dd'T'HH:mm:ss")
      });
    }
  }, [data?.data]);

  const onSubmit = (values: DiscountInput) => {
    uploadDialog.openDialog({
      status: "uploading",
      message: "Updating discount..."
    });
    update.mutate(values, {
      onSuccess: () => {
        uploadDialog.openDialog({
          status: "success",
          message: "Discount updated."
        });
        setTimeout(uploadDialog.closeDialog, 3000);
      },
      onError: () => {
        uploadDialog.openDialog({ status: "error", message: "Update failed." });
        setTimeout(uploadDialog.closeDialog, 5000);
      }
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading discount</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Discount</h1>
        <DiscountFormFields form={form} />
        <Button type="submit">Update Discount</Button>
      </form>
      {uploadDialog.DialogComponent({ progress: 0 })}
    </Form>
  );
};

export default DiscountEdit;
