export interface AuthResponseDto {
  success: boolean;
  message?: string | null;
  data?: any;
  errors?: any;
}
