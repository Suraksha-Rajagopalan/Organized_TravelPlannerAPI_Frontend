export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export interface ApiResponse<T> {
  message: string;
  result: T;
}
