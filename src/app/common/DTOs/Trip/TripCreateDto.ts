export interface BudgetDetailsDto {
  food: number;
  hotel: number;
}

export interface TripCreateDto {
  title: string;
  destination: string;
  startDate: string; // ISO date string (e.g., "2025-08-04T00:00:00Z")
  endDate: string;

  budget: number; // default is 0
  travelMode: string;
  notes: string;

  userId: number;

  image?: string | null;
  description?: string | null;
  duration?: string | null;
  bestTime?: string | null;

  essentials: string[];     
  touristSpots: string[];

  budgetDetails?: BudgetDetailsDto | null;
}
