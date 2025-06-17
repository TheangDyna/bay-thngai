// src/components/review/ReviewForm.tsx
import { useSubmitReviewMutation } from "@/api/review";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  const { mutate, isPending } = useSubmitReviewMutation(productId);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            onClick={() => setRating(i + 1)}
            className={`text-yellow-500 ${i >= rating ? "opacity-30" : ""}`}
          >
            <Star size={20} fill={i < rating ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
      <Textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Share your experience..."
      />
      <Button
        onClick={() => mutate({ rating, review })}
        disabled={isPending || !review}
      >
        Submit Review
      </Button>
    </div>
  );
}
