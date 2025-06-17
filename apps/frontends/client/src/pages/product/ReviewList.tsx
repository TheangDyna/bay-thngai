// src/components/review/ReviewList.tsx
import { useReviewsQuery } from "@/api/review";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationState } from "@tanstack/react-table";
import { Star } from "lucide-react";
import { useState } from "react";

export function ReviewList({ productId }: { productId: string }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });

  const { data, isLoading, isError } = useReviewsQuery({
    productId,
    pagination,
    sorting: [],
    columnFilters: []
  });

  return (
    <div>
      {isLoading ? (
        [...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-md" />
        ))
      ) : isError ? (
        <p className="text-red-500">Failed to load reviews.</p>
      ) : data?.data.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet.</p>
      ) : (
        <>
          {data?.data.map((review) => (
            <div key={review._id} className="border-b pb-3">
              <div className="flex justify-between items-center">
                <p className="font-medium">{review.user.email}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < review.rating ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {review.review}
              </p>
            </div>
          ))}

          {data && data.total > pagination.pageSize && (
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.pageIndex === 0}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: prev.pageIndex - 1
                  }))
                }
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={
                  data
                    ? (pagination.pageIndex + 1) * pagination.pageSize >=
                      data.total
                    : true
                }
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: prev.pageIndex + 1
                  }))
                }
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
