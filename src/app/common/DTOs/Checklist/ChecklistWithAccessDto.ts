import { ChecklistItemDto } from "./ChecklistItemDto";

export interface ChecklistWithAccessDto {
  items: (ChecklistItemDto | null)[];
  accessLevel: string;
}
