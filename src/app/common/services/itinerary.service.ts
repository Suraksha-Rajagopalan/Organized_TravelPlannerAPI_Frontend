import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { ItineraryItemCreateDto } from '../DTOs/Itinerary/ItineraryItemCreateDto';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private baseUrl = 'http://localhost:5276/api/v1';

  constructor(private http: HttpClient, private authService: AuthService) { }
  // ─── Itinerary ───────────────────────────────────────────────────────────

  getItinerary(
    tripId: number
  ): Observable<ItineraryItemCreateDto[]> {
    const params = new HttpParams().set('tripId', tripId.toString());
    return this.http
      .get<{ result: ItineraryItemCreateDto[] }>(
        `${this.baseUrl}/Itinerary`,
        { params }

      )
      .pipe(map(resp => resp.result));
  }

  addItineraryItem(
    tripId: number,
    userId: number,
    item: ItineraryItemCreateDto
  ): Observable<ItineraryItemCreateDto> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('tripId', tripId.toString());

    return this.http
      .post<{ result: ItineraryItemCreateDto }>(
        `${this.baseUrl}/Itinerary`,
        item,
        { params }           
      )
      .pipe(map(resp => resp.result));
  }

  updateItineraryItem(
    tripId: number,
    userId: number,
    id: number,
    item: ItineraryItemCreateDto
  ): Observable<void> {
    const params = new HttpParams()
    .set('userId', userId.toString())
    .set('tripId', tripId.toString())
    .set('id', id.toString());
    return this.http
      .put<void>(
        `${this.baseUrl}/Itinerary/${item.id}`,
        item,
        { params }
      )
      .pipe(map(() => void 0));
  }

  deleteItineraryItem(
    tripId: number,
    userId: number,
    id: number
  ): Observable<void> {
    const params = new HttpParams()
    .set('tripId', tripId.toString())
    .set('userId', userId.toString())
    .set('id', id.toString());
    return this.http
      .delete<void>(
        `${this.baseUrl}/Itinerary/${id}`,
        { params }
      )
      .pipe(map(() => void 0));
  }

  getSharedItinerary(tripId: number): Observable<ItineraryItemCreateDto[]> {
    return this.http.get<any>(`${this.baseUrl}/shared/trips/${tripId}/itinerary`).pipe(
      map(response => response.result)
    );
  }
}