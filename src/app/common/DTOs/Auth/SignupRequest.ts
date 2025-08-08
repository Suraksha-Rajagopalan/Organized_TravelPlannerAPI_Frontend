export interface SignupRequest {
  name: string;      // Required
  email: string;     // Required, must be a valid email (validated on frontend)
  password: string;  // Required
}
