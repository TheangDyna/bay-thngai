import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleDot, Clock, DollarSign, Pencil, Trash2 } from "lucide-react";
import { formatDistance } from "date-fns";
import { useProductQuery } from "@/api/product.api";
import Error from "@/pages/Error";

const ProductDetail: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/products/${productId}/edit`);
  };

  const productQuery = useProductQuery(productId);

  if (productQuery.isPending) {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-6">
          <div className="lg:col-span-3 space-y-5">
            <Skeleton className="aspect-square w-full rounded-xl" />
          </div>
          <div className="lg:col-span-2 space-y-5">
            <Skeleton className="aspect-square w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (productQuery.error) {
    return <Error />;
  }

  const product = productQuery.data?.data;

  if (!product) {
    return <div>Page Not Found!!!</div>;
  }

  const formattedDate = formatDistance(
    new Date(product.updatedAt),
    new Date(),
    {
      addSuffix: true
    }
  );

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* <Button variant="ghost" size="icon" onClick={handleBackClick}>
              <ArrowLeft className="h-5 w-5" />
            </Button> */}
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Updated {formattedDate}</span>
              <CircleDot className="h-3 w-3" />
              <span>{product.inStock ? "In Stock" : "Out of Stock"}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="destructive" onClick={() => {}}>
            <Trash2 className="h-5 w-5" />
          </Button>
          <Button size="icon" onClick={handleEditClick}>
            <Pencil className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-6">
        {/* Details */}
        <div className="lg:col-span-3 space-y-5">
          <Card className="p-6">
            <div className="mb-6 flex items-baseline justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Price
                </p>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-6 w-6" />
                  <span className="text-2xl font-bold">{product.price}</span>
                </div>
              </div>
              <Badge
                variant={product.inStock ? "default" : "secondary"}
                className="text-base"
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {product.cuisines.length > 0 && (
                <div>
                  <h3 className="mb-2 font-medium">Cuisines</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.cuisines.map((cuisine) => (
                      <Badge key={cuisine.name} variant="secondary">
                        {cuisine.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
          {product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg border bg-muted"
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div className="lg:col-span-2 space-y-5">
          <div className="aspect-square overflow-hidden rounded-xl border bg-muted">
            <img
              src={product.thumbnail}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
