import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { TripReviewDto } from '../DTOs/TripReviews/TripReviewDto';
import { environment } from '../../../environments/environment.development';



@Injectable({
    providedIn: 'root'
})
export class ReviewsService {
    private baseUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient, private authService: AuthService) { }

     searchTripReviews(destination: string): Observable<TripReviewDto[]> {
         return this.http
           .get<{ result: TripReviewDto[] }>(`${this.baseUrl}/TripReviews/search`, {
             params: { destination }
           })
           .pipe(map(resp => resp.result));
       }
}