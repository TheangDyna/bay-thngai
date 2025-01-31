import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { MultiSelect } from "@/components/MultiSelect";
import { useProductQuery, useUpdateProductMutation } from "@/api/product.api";
import { useCuisinesQuery } from "@/api/cuisine.api";
import { ImagesInput } from "@/components/ImagesInput";
import { Switch } from "@/components/ui/switch";
import { ThumbnailInput } from "@/components/ThumbnailInput";
import {
  ProductDefaultValue,
  ProductSchema
} from "@/validators/product.validators";
import { ProductInput } from "@/types/product.types";
import { useUploadDialog } from "@/hooks/useUploadDialog";
import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "@/pages/Error";

export const ProductEdit: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { mutation: updateProductMutation, progress } =
    useUpdateProductMutation(productId!);
  const cuisinesQuery = useCuisinesQuery({});
  const productQuery = useProductQuery(productId!);
  const uploadDialog = useUploadDialog();

  const form = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    defaultValues: ProductDefaultValue
  });

  const cuisinesOptions = useMemo(
    () =>
      cuisinesQuery.data?.data.map((cuisine) => ({
        value: cuisine._id,
        label: cuisine.name
      })) || [],
    [cuisinesQuery.data]
  );

  useEffect(() => {
    if (productQuery.data?.data) {
      const product = { ...productQuery.data.data };
      product.cuisines = product.cuisines.map((cuisine) => cuisine._id);
      form.reset(product);
    }
  }, [productQuery.data, form]);

  const onSubmit = (data: ProductInput) => {
    uploadDialog.openDialog({
      status: "uploading",
      message: "Updating product..."
    });

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("inStock", data.inStock.toString());
    formData.append("description", data.description);
    data.cuisines.forEach((cuisine) => formData.append("cuisines[]", cuisine));
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
    data.images?.forEach((image) => formData.append("images", image));

    updateProductMutation.mutate(formData, {
      onSuccess: () => {
        uploadDialog.openDialog({
          status: "success",
          message: "Product updated successfully!"
        });
        setTimeout(uploadDialog.closeDialog, 3000);
      },
      onError: (error: any) => {
        uploadDialog.openDialog({
          status: "error",
          message:
            "There was an issue updating the product. Please check the form for errors."
        });

        const serverMessage = error.response?.data?.message || "";
        if (serverMessage.includes("Duplicate value")) {
          const match = serverMessage.match(/Duplicate value "(.*?)"/);
          const duplicateValue = match ? match[1] : "value";
          const fieldMatch = serverMessage.match(/field "(.*?)"/);
          const fieldName = fieldMatch ? fieldMatch[1] : "field";

          if (fieldName) {
            form.setError(fieldName as keyof ProductInput, {
              type: "server",
              message: `The ${fieldName} "${duplicateValue}" is already in use. Please choose a different ${fieldName}.`
            });
          }
        }
        setTimeout(uploadDialog.closeDialog, 5000);
      }
    });
  };

  if (productQuery.isError || cuisinesQuery.isError) {
    return <Error />;
  }

  if (productQuery.isLoading || cuisinesQuery.isLoading) {
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
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="lg:col-span-2 space-y-5">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button> */}
              <div>
                <h1 className="text-2xl font-bold">Update Product</h1>
              </div>
            </div>
            {/* Submit screen lg */}
            <Button type="submit" className="hidden md:inline-flex">
              Update Product
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-6">
            <div className="lg:col-span-3 space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Product Name"
                        autoComplete="product"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Price"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Cuisines */}
              <FormField
                control={form.control}
                name="cuisines"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisines</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={cuisinesOptions}
                        name={field.name}
                        control={form.control}
                        value={field.value}
                        placeholder="Select Cuisine"
                        variant="secondary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Images */}
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Product Images</FormLabel>
                    <FormControl>
                      <ImagesInput control={form.control} name={field.name} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="lg:col-span-2 space-y-3">
              {/* Thumbnail */}
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Thumbnail</FormLabel>
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
              {/* In Stock */}
              <FormField
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>In Stock</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          name={field.name}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Submit screen sm */}
          <Button type="submit" className="md:hidden">
            Update Product
          </Button>
        </form>
      </Form>
      {uploadDialog.DialogComponent({ progress })}
    </>
  );
};

export default ProductEdit;
