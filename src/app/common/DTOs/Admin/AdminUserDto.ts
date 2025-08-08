export interface AdminUserDto {
  id: number;
  name: string;
  email: string;
  lastLoginDate: string | null;
  numberOfTrips: number;
  isActive: boolean;
  tripTitles: string[];
  role: string;
}
