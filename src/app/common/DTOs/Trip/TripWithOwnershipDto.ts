// src/app/models/trip-with-ownership.model.ts

import { TripDto } from "./TripDto";

export interface TripWithOwnership extends TripDto {
  isOwner?: boolean;
  accessLevel?: 'View' | 'Edit';
}
