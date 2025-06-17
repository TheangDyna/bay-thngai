// src/components/review/RatingBreakdown.tsx
import { useRatingSummaryQuery } from "@/api/review";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

interface RatingBreakdownProps {
  productId: string;
}

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  productId
}) => {
  const { data, isLoading } = useRatingSummaryQuery(productId);

  if (isLoading) {
    return <Skeleton className="h-36 w-full rounded-md" />;
  }

  if (!data) return null;

  const { total, breakdown } = data.data;

  return (
    <div className="space-y-2">
      {breakdown.map((item) => (
        <div key={item.rating} className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="w-3 text-sm font-medium">{item.rating} </span>
            <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
          </div>
          <div className="flex-1 h-2 bg-muted rounded">
            <div
              className="bg-primary h-full rounded"
              style={{ width: `${item.percent}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {Math.round(item.percent)}%
          </span>
        </div>
      ))}
      <p className="text-sm text-muted-foreground pt-1">
        Total Reviews: {total}
      </p>
    </div>
  );
};
