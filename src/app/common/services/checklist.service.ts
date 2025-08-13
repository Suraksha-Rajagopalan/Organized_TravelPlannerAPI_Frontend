import { Injectable } from '@angular/core';
import { ChecklistItemDto } from '../DTOs/Checklist/ChecklistItemDto';
import { ChecklistItemUpdateDto } from '../DTOs/Checklist/ChecklistItemUpdateDto';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { ChecklistWithAccessDto } from '../DTOs/Checklist/ChecklistWithAccessDto';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class ChecklistService {
    private baseUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient, private authService: AuthService) { }
    // ─── Checklist ───────────────────────────────────────────────────────────

    getChecklist(
        tripId: number
    ): Observable<ChecklistWithAccessDto[]> {
        const params = new HttpParams().set('tripId', tripId.toString());
        return this.http
            .get<{ result: ChecklistWithAccessDto[] }>(
                `${this.baseUrl}/Checklist/${tripId}`,
                { params }
            )
            .pipe(map(resp => resp.result));
    }

    addChecklistItem(
        item: ChecklistItemDto
    ): Observable<ChecklistItemDto> {
        return this.http
            .post<{ result: ChecklistItemDto }>(
                `${this.baseUrl}/Checklist`,
                item
            )
            .pipe(map(resp => resp.result));
    }

    updateChecklistItem(
        id: number,
        item: ChecklistItemUpdateDto
    ): Observable<void> {
        const params = new HttpParams().set('id', id.toString());
        return this.http
            .put<void>(
                `${this.baseUrl}/Checklist/${item.id}`,
                item,
                { params }
            )
            .pipe(map(() => void 0));
    }

    deleteChecklistItem(
        id: number
    ): Observable<void> {
        const params = new HttpParams().set('id', id.toString());
        return this.http
            .delete<void>(
                `${this.baseUrl}/Checklist/${id}`,
                { params }
            )
            .pipe(map(() => void 0));
    }

    toggleChecklistItem(id: number): Observable<void> {
        const params = new HttpParams().set('id', id.toString());
        return this.http
            .patch<void>(`${this.baseUrl}/Checklist/${id}/toggle`, { params });
    }

}