import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
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
import { useCreateProductMutation } from "@/api/product.api";
import { useCuisinesQuery } from "@/api/cuisine.api";
import { ImagesInput } from "@/components/ImagesInput";
import { Switch } from "@/components/ui/switch";
import { ThumbnailInput } from "@/components/ThumbnailInput";
import {
  ProductDefaultValue,
  ProductSchema
} from "@/validators/product.validators";
import { ProductInput } from "@/types/product.types";
import { UploadDialog } from "@/components/UploadDialog";
import { useState } from "react";

const ProductCreate: React.FC = () => {
  const { mutation: createProductMutation, progress } =
    useCreateProductMutation();
  const cuisinesQuery = useCuisinesQuery();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const form = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    defaultValues: ProductDefaultValue
  });

  const onSubmit = (data: ProductInput) => {
    setIsDialogOpen(true);
    setUploadStatus("uploading");

    const formData = new FormData();

    // Append basic fields with explicit type conversion
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("inStock", data.inStock.toString());
    formData.append("description", data.description);

    // Append cuisines, dietaries, ingredients
    data.cuisines.forEach((cuisine) => formData.append("cuisines[]", cuisine));
    data.dietaries?.forEach((dietary) =>
      formData.append("dietaries[]", dietary)
    );
    data.ingredients?.forEach((ingredient) =>
      formData.append("ingredients[]", ingredient)
    );

    // Append files
    data.thumbnail && formData.append("thumbnail", data.thumbnail);
    data.images?.forEach((image) => formData.append("images", image));

    createProductMutation.mutate(formData, {
      onSuccess: (response) => {
        toast({
          title: "Success",
          description: `Product created successfully: ${response.data.name}`
        });
        setUploadStatus("success");
        form.reset();
      },
      onError: (error: any) => {
        setUploadStatus("error");
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to create product.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-6">
            <div className="lg:col-span-3 space-y-3">
              {/* Product Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Name" {...field} />
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
                        onChange={(e) => field.onChange(Number(e.target.value))}
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

              {/* Thumbnail */}
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

              {/* Images */}
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Images</FormLabel>
                    <FormControl>
                      <ImagesInput control={form.control} name={field.name} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="lg:col-span-2 space-y-3">
              {/* Cuisines */}
              <FormField
                control={form.control}
                name="cuisines"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisines</FormLabel>
                    <FormControl>
                      {cuisinesQuery.isLoading ? (
                        <p>Loading cuisines...</p>
                      ) : (
                        <MultiSelect
                          options={cuisinesQuery.data.data?.map(
                            (cuisine: any) => ({
                              value: cuisine._id,
                              label: cuisine.name
                            })
                          )}
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                          placeholder="Select Cuisine"
                          variant="secondary"
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dietaries */}
              <FormField
                control={form.control}
                name="dietaries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietaries</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={[]}
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                        placeholder="Select Dietary"
                        variant="secondary"
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
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit">Create Product</Button>
        </form>
      </Form>
      <UploadDialog
        isOpen={isDialogOpen}
        status={uploadStatus}
        progress={progress}
        message={
          uploadStatus === "uploading"
            ? "Creating product and uploading images..."
            : uploadStatus === "success"
              ? "Product created successfully!"
              : uploadStatus === "error"
                ? "An error occurred while creating the product"
                : ""
        }
        onClose={() => {
          setIsDialogOpen(false);
          setUploadStatus("idle");
        }}
      />
    </>
  );
};

export default ProductCreate;
