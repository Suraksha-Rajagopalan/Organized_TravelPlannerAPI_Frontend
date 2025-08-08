import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { ReviewDto } from '../DTOs/Reviews/ReviewDto';


@Injectable({
    providedIn: 'root'
})
export class RateService {
    private baseUrl = 'http://localhost:5276/api/v1';

    constructor(private http: HttpClient, private authService: AuthService) { }

     // ─── Reviews & Ratings ────────────────────────────────────────────────────

    getReview(tripId: number): Observable<ReviewDto | null> {
        const params = new HttpParams().set('tripId', tripId.toString());
        return this.http
            .get<{ result: ReviewDto[] }>(
                `${this.baseUrl}/Reviews/${tripId}`,
                { params }
            )
            .pipe(
                map(resp => (resp.result.length ? resp.result[0] : null)),
                catchError(() => of(null))
            );
    }


    submitRatingAndReview(
        payload: ReviewDto
    ): Observable<ReviewDto | null> {
        return this.http
            .post<{ result: ReviewDto }>(
                `${this.baseUrl}/Reviews`,
                payload
            )
            .pipe(
                map(resp => resp.result),
                catchError(() => of(null))
            );
    }
}