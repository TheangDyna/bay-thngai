import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ChefHat,
  Clock,
  DollarSign,
  ImagePlus,
  Images,
  Pencil,
  Plus,
  Save,
  ShoppingCart,
  Tag,
  Trash2
} from "lucide-react";
import { formatDistance } from "date-fns";
import { useProductQuery } from "@/api/product.api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

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

const ProductDetail1: React.FC = () => {
  const { productId } = useParams();

  const productQuery = useProductQuery(productId);

  if (productQuery.isPending) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-12">
        <ProductSkeleton />
      </div>
    );
  }

  if (productQuery.error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-destructive">
          Error loading product details
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const product = productQuery.data?.data;

  if (!product) {
    return <div>Page Not Found!!!</div>;
  }

  const handleSave = () => {
    console.log("Changes saved successfully!");
  };

  const handleDelete = () => {
    console.log("Product deleted successfully!");
  };

  const formattedDate = formatDistance(
    new Date(product.updatedAt),
    new Date(),
    {
      addSuffix: true
    }
  );
  const formattedCreatedDate = formatDistance(
    new Date(product.createdAt),
    new Date(),
    { addSuffix: true }
  );

  return (
    <div className="min-h-screen bg-background p-5">
      <div>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Product</h1>
              <p className="text-sm text-muted-foreground">
                Created {formattedCreatedDate} • Updated {formattedDate}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleDelete}>
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-5 w-5" />
              Save Changes
            </Button>
          </div>
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
            <div className="grid gap-6 md:grid-cols-3">
              {/* Left Column */}
              <div className="space-y-4 md:col-span-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" defaultValue={product.name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue={product.description}
                    className="min-h-[150px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      defaultValue={product.price}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cuisines</Label>
                  <ScrollArea className="h-[120px] rounded-md border p-4">
                    <div className="flex flex-wrap gap-2">
                      {product.cuisines.map((cuisine) => (
                        <Badge key={cuisine.name} variant="secondary">
                          {cuisine.name}
                          <button className="ml-1 hover:text-destructive">
                            ×
                          </button>
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Cuisine
                      </Button>
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Right Column */}
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="status">Status</Label>
                    <Switch id="status" defaultChecked={product.inStock} />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Thumbnail</Label>
                    <div className="relative aspect-square overflow-hidden rounded-lg border">
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-2 right-2"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Images</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {product.images.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="h-full w-full rounded-lg object-cover"
                          />
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-1 top-1 h-6 w-6"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="aspect-square flex-col gap-2"
                      >
                        <ImagePlus className="h-5 w-5" />
                        <span className="text-xs">Add Image</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="media">
            <Card className="p-6">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Product Images</h3>
                    <Button>
                      <Images className="mr-2 h-5 w-5" />
                      Upload Images
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="group relative aspect-square">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="h-full w-full rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 hidden rounded-lg bg-black/50 group-hover:flex">
                          <div className="m-auto flex gap-2">
                            <Button size="icon" variant="secondary">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="secondary">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
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
      </div>
    </div>
  );
};

export default ProductDetail1;
