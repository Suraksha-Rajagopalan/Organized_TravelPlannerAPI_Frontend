export interface TripReviewDto {
  tripId: number;         // Required

  tripName: string;       // Defaults to empty string in C#

  username: string;       // Defaults to empty string in C#

  rating: number;         // Optional validation (e.g., range) should be handled in frontend

  comment?: string | null; // Optional, max 300 characters (validated on frontend)
}
