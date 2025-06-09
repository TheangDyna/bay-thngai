import { useCuisinesQuery } from "@/api/cuisine";
import { useCreateProductMutation } from "@/api/product";
import { ImagesInput } from "@/components/ImagesInput";
import { MultiSelect } from "@/components/MultiSelect";
import { ThumbnailInput } from "@/components/ThumbnailInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useUploadDialog } from "@/hooks/useUploadDialog";
import { ProductInput } from "@/types/product.types";
import {
  ProductDefaultValue,
  ProductSchema
} from "@/validators/product.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";

function ProductSkeleton() {
  return (
    <Card className="mx-auto max-w-6xl overflow-hidden">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <Skeleton className="h-[400px] w-full" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-20" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}

const CreateTest: React.FC = () => {
  const { mutation: createProductMutation, progress } =
    useCreateProductMutation();
  const cuisinesQuery = useCuisinesQuery({});
  const uploadDialog = useUploadDialog();

  const form = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    defaultValues: ProductDefaultValue
  });

  // Handle form submission
  const onSubmit = (data: ProductInput) => {
    uploadDialog.openDialog({
      status: "uploading",
      message: "Creating product..."
    });

    const formData = new FormData();

    // Append fields
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("inStock", data.inStock.toString());
    formData.append("description", data.description);
    data.cuisines.forEach((cuisine) => formData.append("cuisines[]", cuisine));
    data.dietaries?.forEach((dietary) =>
      formData.append("dietaries[]", dietary)
    );
    data.ingredients?.forEach((ingredient) =>
      formData.append("ingredients[]", ingredient)
    );
    data.thumbnail && formData.append("thumbnail", data.thumbnail);
    data.images?.forEach((image) => formData.append("images", image));

    // Mutation
    createProductMutation.mutate(formData, {
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

  // Show skeletons while cuisines are loading
  if (cuisinesQuery.isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-6">
        <div className="lg:col-span-3 space-y-5">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="lg:col-span-2 space-y-5">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  const cuisinesOptions =
    cuisinesQuery.data?.data.map((cuisine) => ({
      value: cuisine._id,
      label: cuisine.name
    })) || [];
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Create Product</h1>
              </div>
            </div>
            {/* Submit screen lg */}
            <Button type="submit" className="hidden md:inline-flex">
              Create Product
            </Button>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-6">
                <div className="lg:col-span-3 space-y-3">
                  {/* Name */}
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
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                          <Textarea
                            placeholder="Description"
                            {...field}
                            rows={5}
                          />
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
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media">
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
            </TabsContent>

            <TabsContent value="variants">
              <Card className="p-6">
                <div className="text-center text-muted-foreground">
                  No variants available for this product
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="inventory">
              <Card className="p-6">
                <div className="text-center text-muted-foreground">
                  Inventory management coming soon
                </div>
              </Card>
            </TabsContent>
          </Tabs>
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

export default CreateTest;
