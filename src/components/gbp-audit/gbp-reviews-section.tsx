"use client";

import { Star } from "lucide-react";

interface Review {
  rating: number;
  date: string;
  comment: string;
}

interface GBPReviewsSectionProps {
  id: string;
  goodReviews: Review[];
  badReviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-card border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={review.rating} />
        <span className="text-sm text-muted-foreground">{review.date}</span>
      </div>
      <p className="text-sm text-muted-foreground">{review.comment}</p>
    </div>
  );
}

export function GBPReviewsSection({ id, goodReviews, badReviews }: GBPReviewsSectionProps) {
  return (
    <div className="mb-8" id={id}>
      {goodReviews.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">Recent Good Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goodReviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        </div>
      )}

      {badReviews.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Recent Bad Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badReviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
