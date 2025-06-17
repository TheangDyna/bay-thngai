export interface Review {
  _id: string;
  rating: number;
  review: string;
  product: {
    _id: string;
  };
  createdAt: string;
  user: {
    email: string;
  };
}

export interface RatingBreakdownItem {
  rating: number;
  count: number;
  percent: number;
}

export interface RatingSummary {
  total: number;
  breakdown: RatingBreakdownItem[];
}
