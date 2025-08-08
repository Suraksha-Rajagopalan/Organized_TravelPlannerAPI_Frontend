import { TripCreateDto } from "./TripCreateDto";

export interface TripUpdateDto extends TripCreateDto {
  id: number; // Required for update
}
