export interface TripShareRequestDto {
  tripId: number;               // Required

  sharedWithEmail: string;      // Required, must be a valid email (validate in frontend)

  accessLevel: 'View' | 'Edit'; // Limited to allowed values (can be string if not enforced)
}
