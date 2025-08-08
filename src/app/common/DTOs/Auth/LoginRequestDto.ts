export interface LoginRequestDto {
  email: string;    // Must be a valid email (validate on frontend)
  password: string; // Required
}
