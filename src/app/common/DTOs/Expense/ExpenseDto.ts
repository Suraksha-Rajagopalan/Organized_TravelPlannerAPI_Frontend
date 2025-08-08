export interface ExpenseDto {
  id: number;
  tripId: number; 
  category: string;
  description?: string | null;
  amount: number;
  date: string;
}
