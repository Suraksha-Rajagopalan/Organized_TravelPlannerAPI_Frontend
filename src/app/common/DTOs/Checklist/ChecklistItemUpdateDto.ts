export interface ChecklistItemUpdateDto {
  id?: number;
  tripId?: number;
  description: string;
  isCompleted: boolean;
}