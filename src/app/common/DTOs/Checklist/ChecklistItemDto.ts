export interface ChecklistItemDto {
  id?: number;
  tripId: number;
  description: string;
  isCompleted: boolean;
  userId?: number | null;
}
