export interface TripWithAccessDto {
  id: number;              // Required
  tripId: number;          // Required
  tripName: string;        // Initialized with empty string
  ownerEmail?: string | null;   // Optional + nullable, validate as email in frontend
  accessLevel?: string | null; // Optional + nullable
}
