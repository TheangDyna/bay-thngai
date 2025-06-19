import {
  useAssignDiscountMutation,
  useDiscountQuery,
  useDiscountsQuery,
  useRemoveDiscountMutation
} from "@/api/discount";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUploadDialog } from "@/hooks/useUploadDialog";
import { DiscountFacetedSelect } from "@/pages/discounts/apply/DiscountFacetedSelect";
import { ProductSelector } from "@/pages/discounts/apply/ProductSelector";
import { Discount } from "@/types/discount.types";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ApplyDiscount: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const discountId = searchParams.get("discount") || undefined;

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const uploadDialog = useUploadDialog();

  const { data: selectedDiscount, isLoading: isLoadingDiscount } =
    useDiscountQuery(discountId!);

  const { data: discountsData, isLoading: isDiscountsLoading } =
    useDiscountsQuery({
      pagination: { pageIndex: 0, pageSize: 100 },
      sorting: [],
      columnFilters: []
    });

  const assignDiscount = useAssignDiscountMutation();
  const removeDiscount = useRemoveDiscountMutation();

  const discountOptions = useMemo(
    () =>
      discountsData?.data.map((d: Discount) => ({
        label: d.name,
        value: d._id
      })) || [],
    [discountsData]
  );

  const handleApply = () => {
    if (!discountId || selectedProducts.length === 0) return;
    uploadDialog.openDialog({
      status: "uploading",
      message: "Applying discount..."
    });

    assignDiscount.mutate(
      { discountId, productIds: selectedProducts },
      {
        onSuccess: () => {
          uploadDialog.openDialog({
            status: "success",
            message: "Discount applied to selected products"
          });
          setSelectedProducts([]);
          setTimeout(uploadDialog.closeDialog, 3000);
        },
        onError: () => {
          uploadDialog.openDialog({
            status: "error",
            message: "Failed to apply discount"
          });
          setTimeout(uploadDialog.closeDialog, 5000);
        }
      }
    );
  };

  const handleRemove = () => {
    if (selectedProducts.length === 0) return;
    uploadDialog.openDialog({
      status: "uploading",
      message: "Removing discount..."
    });

    removeDiscount.mutate(
      { productIds: selectedProducts },
      {
        onSuccess: () => {
          uploadDialog.openDialog({
            status: "success",
            message: "Discount removed from selected products"
          });
          setSelectedProducts([]);
          setTimeout(uploadDialog.closeDialog, 3000);
        },
        onError: () => {
          uploadDialog.openDialog({
            status: "error",
            message: "Failed to remove discount"
          });
          setTimeout(uploadDialog.closeDialog, 5000);
        }
      }
    );
  };

  if (isDiscountsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <DiscountFacetedSelect
          options={discountOptions}
          value={discountId}
          onChange={(val) => {
            const newParams = new URLSearchParams(searchParams);
            if (val) {
              newParams.set("discount", val);
            } else {
              newParams.delete("discount");
            }
            setSearchParams(newParams, { replace: true });
          }}
        />

        <div className="flex gap-2 items-center">
          <div className="text-sm text-muted-foreground">
            {selectedProducts.length}{" "}
            {selectedProducts.length > 1 ? "Products" : "Product"}
          </div>
          <Button
            variant="secondary"
            color="red"
            onClick={handleRemove}
            disabled={selectedProducts.length === 0}
          >
            Remove
          </Button>
          <Button
            onClick={handleApply}
            disabled={!discountId || selectedProducts.length === 0}
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Discount Info */}
      {isLoadingDiscount ? (
        <Skeleton className="h-6 w-[60%]" />
      ) : discountId && selectedDiscount?.data ? (
        <p className="text-sm text-muted-foreground">
          {selectedDiscount.data.type === "percentage"
            ? `${selectedDiscount.data.amount}% off`
            : `$${selectedDiscount.data.amount} off`}{" "}
          | Valid from{" "}
          {format(new Date(selectedDiscount.data.startDate), "PPpp")} to{" "}
          {format(new Date(selectedDiscount.data.endDate), "PPpp")}
        </p>
      ) : null}

      {/* Product Selector */}
      <ProductSelector
        selected={selectedProducts}
        onChange={setSelectedProducts}
      />

      {/* Upload Dialog */}
      {uploadDialog.DialogComponent({ progress: 0 })}
    </div>
  );
};

export default ApplyDiscount;
