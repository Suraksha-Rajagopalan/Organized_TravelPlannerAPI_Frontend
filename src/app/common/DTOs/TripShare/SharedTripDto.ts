export interface SharedTripDto {
  tripId: number;

  accessLevel: 'ReadOnly' | 'ReadWrite' | 'Owner'; // Adjust to match your AccessLevel enum values

  titleName: string;
  destination: string;

  startDate: string | null; // ISO date string or null
  endDate: string | null;

  tripDescription: string;
  travelMode: string;

  tripBudget?: number | null; // Optional decimal

  tripNotes: string;
  tripImage: string;

  duration?: string | null;
  bestTime: string;

  essentials: string[];
  touristSpots: string[];

  title: string;
  description?: string | null;
  budget: number;
  notes: string;
  image?: string | null;
}
