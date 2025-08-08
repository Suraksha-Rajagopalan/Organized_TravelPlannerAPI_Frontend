import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { TripShareRequestDto } from '../DTOs/TripShare/TripShareRequestDto';
import { TripDto } from '../DTOs/Trip/TripDto';



@Injectable({
    providedIn: 'root'
})
export class ShareService {
    private baseUrl = 'http://localhost:5276/api/v1';

    constructor(private http: HttpClient, private authService: AuthService) { }

    
    // ─── Shared Trips ────────────────────────────────────────────────────────

  shareTrip(
    dto: TripShareRequestDto
  ): Observable<string> {
    return this.http
      .post<{ message: string }>(
        `${this.baseUrl}/TripShare/share`,
        dto
      )
      .pipe(map(resp => resp.message));
  }

  getSharedTrips(): Observable<TripDto[]> {
    return this.http
      .get<{ result: TripDto[] }>(
        `${this.baseUrl}/TripShare/shared-with-me`
      )
      .pipe(map(resp => resp.result));
  }
    
}