// This is for creating a new item (without `id`)
export interface ItineraryItemCreateDto {
  id?: number;
  title: string; // Required
  description: string; // Optional, max length 300 (handled by frontend validation)
  scheduledDateTime: string; // ISO 8601 string format (e.g., "2025-08-04T14:30:00Z")
}
