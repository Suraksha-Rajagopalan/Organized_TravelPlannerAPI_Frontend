export interface ReviewDto {
  tripId: number;     // Required
  userId: number;     // Required
  rating: number;     // Optional validation (e.g., range) not specified in C#
  review: string;     // Optional, max 300 characters (validate on frontend)
}
