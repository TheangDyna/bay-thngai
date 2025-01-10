import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().positive().min(1),
  description: z.string().min(10),
  cuisines: z.array(z.string().min(1)).min(1),
  dietaries: z.array(z.string().min(1)).optional(),
  inStock: z.boolean().default(true),
  calories: z.number().positive().optional(),
  protein: z.number().positive().optional(),
  carbs: z.number().positive().optional(),
  fats: z.number().positive().optional(),
  ingredients: z.array(z.string().min(1)).optional(),
  thumbnail: z.instanceof(File).optional(),
  images: z.array(z.instanceof(File)).optional()
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductCreate: React.FC = () => {
  const createProductMutation = useCreateProductMutation();
  const cuisinesQuery = useCuisinesQuery();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      cuisines: [],
      dietaries: [],
      inStock: true,
      thumbnail: undefined,
      images: []
    }
  });

  const onSubmit = (data: ProductFormValues) => {
    createProductMutation.mutate(data, {
      onSuccess: (response) => {
        toast({
          title: "Success",
          description: `Product created successfully: ${response.data.name}`
        });
        form.reset();
      },
      onError: (error: any) => {
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
                    <ThumbnailInput control={form.control} name={field.name} />
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
  );
};

export default ProductCreate;
