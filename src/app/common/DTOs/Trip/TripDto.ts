export interface ReviewDto {
  tripId: number;
  userId: number;
  rating: number;
  review: string;
}

export interface BudgetDetailsDto {
  food: number;
  hotel: number;
}

export interface TripDto {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelMode: string;
  notes: string;
  userId: number;
  image?: string | null;
  description?: string | null;
  duration?: string | null;
  bestTime?: string | null;
  essentials: string[] | null;
  touristSpots: string[] | null;
  budgetDetails?: BudgetDetailsDto | null;
  review?: ReviewDto | null;
}
