import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../../../../../common/services/trip.service';
import { TripDto } from '../../../../../common/DTOs/Trip/TripDto';
import { AuthService } from '../../../../../common/services/auth.service';
import { TripCreateDto } from '../../../../../common/DTOs/Trip/TripCreateDto';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-trip-details',
  standalone: false,
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details implements OnInit {
  trip?: TripDto;
  isAdded: boolean = false;
  errorMessage?: string;
  readOnly: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const tripIdParam = this.route.snapshot.paramMap.get('id'); // your param is 'id'
    const accessType = this.route.snapshot.queryParamMap.get('access');

    if (accessType === 'view') {
      this.readOnly = true;
    }

    const tripId = Number(tripIdParam);
    if (!tripId) {
      this.errorMessage = 'Invalid trip ID';
      return;
    }

    this.tripService.getTripByIdFromBackend(tripId).subscribe({
      next: (trip) => {
        this.trip = trip;
        this.isAdded = this.tripService.getMyTrips().some(t => t.id === trip.id);
      },
      error: () => {
        const sampleTrip = this.tripService.getSampleTripById(tripId);
        if (sampleTrip) {
          this.trip = sampleTrip;
          this.isAdded = this.tripService.getMyTrips().some(t => t.id === sampleTrip.id);
        } else {
          this.errorMessage = 'Trip not found';
        }
      }
    });
  }

  addToMyTrips(): void {
    if (!this.trip || this.isAdded) {
      return;
    }

    const userId = this.authService.getUserId();

    // Basic validation
    if (!userId || userId <= 0) {
      this.errorMessage = 'Invalid user ID';
      console.error('User ID is invalid:', userId);
      return;
    }

    // Log the token if needed
    //console.log('Token:', CookieService.get('jwtToken'));

    // Create a copy of the trip with updated userId
    const newTrip: TripCreateDto = {
      ...this.trip,
      //id: undefined, // Let the backend generate the ID
      userId: userId,
      startDate: this.trip.startDate || '2025-01-01',
      endDate: this.trip.endDate || '2025-01-05',
      travelMode: this.trip.travelMode || 'Not specified',
      notes: this.trip.notes || '',
      budget: this.trip.budget || 0,
      budgetDetails: this.trip.budgetDetails || { food: 0, hotel: 0 },
      essentials: this.trip.essentials || [],
      touristSpots: this.trip.touristSpots || []
    };

    console.log('Trip being saved:', newTrip);

    this.tripService.addTrip(newTrip).subscribe({
      next: (savedTrip) => {
        console.log('Trip saved successfully:', savedTrip);
        this.tripService.addToMyTrips(savedTrip); // Save locally too
        this.isAdded = true;
        this.router.navigate(['/user/dashboard']);
      },
      error: (error) => {
        this.errorMessage = 'Failed to save trip. Please try again.';
        console.error('Error saving trip:', error);
      }
    });
  }
}