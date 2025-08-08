import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { ExpenseDto } from '../DTOs/Expense/ExpenseDto';


@Injectable({
    providedIn: 'root'
})
export class ExpenseService {
    private baseUrl = 'http://localhost:5276/api/v1';

    constructor(private http: HttpClient, private authService: AuthService) { }

    // ─── Expenses ────────────────────────────────────────────────────────────
    
      getExpenses(
        tripId: number
      ): Observable<ExpenseDto[]> {
        const params = new HttpParams().set('tripId', tripId.toString());
        return this.http
          .get<{ result: ExpenseDto[] }>(
            `${this.baseUrl}/Expense`,
            { params }
          )
          .pipe(map(resp => resp.result));
      }
    
      addExpense(
        tripId: number,
        expense: ExpenseDto
      ): Observable<ExpenseDto> {
        const params = new HttpParams().set('tripId', tripId.toString());
        return this.http
          .post<{ result: ExpenseDto }>(
            `${this.baseUrl}/Expense`,
            expense,
            { params }
          )
          .pipe(map(resp => resp.result));
      }
    
      updateExpense(
        tripId: number,
        id: number,
        expense: ExpenseDto
      ): Observable<ExpenseDto> {
        const params = new HttpParams()
        .set('tripId', tripId.toString())
        .set('expenseId', id.toString());
        return this.http
          .put<{ result: ExpenseDto }>(
            `${this.baseUrl}/Expense/${id}`,
            expense,
            { params }
          )
          .pipe(map(resp => resp.result));
      }
    
      deleteExpense(
        tripId: number,
        id: number
      ): Observable<void> {
        const params = new HttpParams()
        .set('tripId', tripId.toString())
        .set('expenseId', id.toString());
        return this.http
          .delete<void>(
            `${this.baseUrl}/Expense/${id}`,
            { params }
          )
          .pipe(map(() => void 0));
      }
    
}