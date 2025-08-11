import { Injectable, resource } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TripDto } from '../DTOs/Trip/TripDto';
import { AuthService } from './auth.service';
import { TripCreateDto } from '../DTOs/Trip/TripCreateDto';
import { TripUpdateDto } from '../DTOs/Trip/TripUpdateDto';
import { ReviewDto } from '../DTOs/Reviews/ReviewDto';
import { ItineraryItemCreateDto } from '../DTOs/Itinerary/ItineraryItemCreateDto';
import { ExpenseDto } from '../DTOs/Expense/ExpenseDto';
import { TripShareRequestDto } from '../DTOs/TripShare/TripShareRequestDto';
import { PaginationParamsDto } from '../DTOs/Trip/PaginationParamsDto';



@Injectable({
  providedIn: 'root'
})
export class TripService {
  private baseUrl = 'http://localhost:5276/api/v1';

  sampleTrips: TripDto[] = [
    {
      id: 101,
      title: 'Beach Getaway',
      destination: 'Goa, India',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      userId: 0,
      image: 'trips/beach.jpg',
      description: 'Relax on sunny beaches and enjoy seafood.',
      duration: '7 Days',
      bestTime: 'October to March',
      essentials: ['Sunscreen', 'Swimwear', 'Sunglasses', 'Flip-flops'],
      touristSpots: ['Baga Beach', 'Fort Aguada', 'Dudhsagar Falls'],
      budgetDetails: {
        food: 3000,
        hotel: 6000
      }
    },
    {
      id: 102,
      title: 'Mountain Adventure',
      destination: 'Manali, India',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      userId: 0,
      image: 'trips/mountain.jpg',
      description: 'Explore snow-covered mountains and trekking routes.',
      duration: '5 Days',
      bestTime: 'December to February',
      essentials: ['Warm Clothes', 'Trekking Shoes', 'Backpack'],
      touristSpots: ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple'],
      budgetDetails: {
        food: 2500,
        hotel: 4500
      }
    },
    {
      id: 103,
      title: 'Cultural Expedition',
      destination: 'Jaipur, India',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      userId: 0,
      image: 'trips/culture.jpg',
      description: 'Dive into Rajasthani culture, food, and architecture.',
      duration: '4 Days',
      bestTime: 'November to February',
      essentials: ['Camera', 'Ethnic Wear', 'Sunscreen'],
      touristSpots: ['Amber Fort', 'City Palace', 'Hawa Mahal'],
      budgetDetails: {
        food: 2000,
        hotel: 3500
      }
    },
    {
      id: 104,
      title: 'Backwater Escape',
      destination: 'Alleppey, Kerala',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      userId: 0,
      image: 'trips/backwater.jpg',
      description: 'Stay in a houseboat and explore Kerala’s backwaters.',
      duration: '3 Days',
      bestTime: 'September to March',
      essentials: ['Mosquito Repellent', 'Camera', 'Cotton Clothes'],
      touristSpots: ['Vembanad Lake', 'Alleppey Beach', 'Krishnapuram Palace'],
      budgetDetails: {
        food: 2200,
        hotel: 4000
      }
    },
    {
      id: 105,
      title: 'Desert Safari',
      destination: 'Jaisalmer, Rajasthan',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      userId: 0,
      image: 'trips/desert.jpg',
      description: 'Enjoy camel rides, folk music, and camping in the desert.',
      duration: '2 Days',
      bestTime: 'October to March',
      essentials: ['Hat', 'Scarf', 'Water Bottle'],
      touristSpots: ['Sam Sand Dunes', 'Jaisalmer Fort', 'Patwon Ki Haveli'],
      budgetDetails: {
        food: 1800,
        hotel: 3000
      }
    }
  ];
  private myTrips: TripDto[] = [];

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Backend API Methods

  // ─── Trips ────────────────────────────────────────────────────────────────

  getTrips(): Observable<TripDto[]> {
    return this.http
      .get<{ result: TripDto[] }>(`${this.baseUrl}/Trip`)
      .pipe(map(resp => resp.result));
  }

  getTripByIdFromBackend(id: number): Observable<TripDto> {
    return this.http.get<any>(`${this.baseUrl}/Trip/${id}`).pipe(
      map(response => response.result) // unwrap AutoWrapper
    );
  }

  getTripById(id: number): Observable<TripDto> {
    return this.http
      .get<{ result: TripDto }>(`${this.baseUrl}/Trip/${id}`)
      .pipe(map(resp => resp.result));
  }

  addTrip(trip: TripCreateDto): Observable<TripDto> {
    return this.http
      .post<{ result: TripDto }>(`${this.baseUrl}/Trip`, trip)
      .pipe(map(resp => resp.result));
  }

  updateTrip(tripId: number, trip: TripUpdateDto): Observable<void> {
    const params = new HttpParams().set('tripId', tripId.toString());
    return this.http.put<void>(
      `${this.baseUrl}/Trip/${trip.id}`,
      trip,
      { params }
    );
  }


  deleteTrip(id: number): Observable<void> {
    return this.http
      .delete<{ isSuccess: boolean }>(`${this.baseUrl}/Trip/${id}`)
      .pipe(
        map(resp => {
          if (resp.isSuccess) return;
          throw new Error('Failed to delete trip');
        })
      );
  }

  getPaginatedTrips(
    pageNumber: number,
    pageSize: number
  ): Observable<PaginationParamsDto<TripDto>> {
    const params = new HttpParams()
      .set('PageNumber', pageNumber.toString())
      .set('PageSize', pageSize.toString());

    return this.http.get<any>(`${this.baseUrl}/Trip/page`, { params })
      .pipe(
        map(res => res.result as PaginationParamsDto<TripDto>) 
      );
  }

  // Local Sample & MyTrips Methods
  getSampleTrips(): TripDto[] {
    return this.sampleTrips;
  }

  getSampleTripById(id: number): TripDto | undefined {
    return this.sampleTrips.find((t: TripDto) => t.id === id);
  }

  getMyTrips(): TripDto[] {
    return this.myTrips;
  }

  addToMyTrips(trip: TripDto): void {
    const exists = this.myTrips.find((t: TripDto) => t.id === trip.id);
    if (!exists) {
      this.myTrips.push(trip);
      console.log('Trip added:', trip);
    }
  }
}