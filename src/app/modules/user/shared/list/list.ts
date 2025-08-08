import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { TripDto } from '../../../../common/DTOs/Trip/TripDto';
import { TripUpdateDto } from '../../../../common/DTOs/Trip/TripUpdateDto';
import { TripWithAccessDto } from '../../../../common/DTOs/Trip/TripWithAccessDto';
import { ReviewDto } from '../../../../common/DTOs/Reviews/ReviewDto';
import { TripWithOwnership } from '../../../../common/DTOs/Trip/TripWithOwnershipDto';

import { TripService } from '../../../../common/services/trip.service';
import { AuthService } from '../../../../common/services/auth.service';
import { RateService } from '../../../../common/services/rate.service';
import { Rate } from '../rate/rate';

@Component({
  selector: 'app-trip-list',
  standalone: false,
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class List implements OnChanges {
  @Input() trips: TripWithOwnership[] = [];
  @Output() tripSelected = new EventEmitter<{ action: 'view' | 'edit', trip: TripDto }>();
  @Output() tripId = new EventEmitter<number>();

  displayedTrips: TripWithOwnership[] = [];
  selectedTrip: TripDto | null = null;
  userId: number;
  tripAccess: TripWithAccessDto[] = [];

  constructor(
    private tripService: TripService,
    private authService: AuthService,
    private rateService: RateService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.userId = this.authService.getUserId();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trips'] && this.trips?.length) {
      this.displayedTrips = this.trips.map(trip => ({
        ...trip,
        isOwner: trip.userId === this.userId
      }));
      this.loadReviewsForTrips();
    }
  }

  emitTripId(trip: TripWithOwnership) {
    if (trip?.id != null) {
      this.tripId.emit(trip.id);
    }
  }

  private loadReviewsForTrips(): void {
    this.displayedTrips.forEach(trip => {
      if (trip.id != null) {
        this.rateService.getReview(trip.id).subscribe({
          next: (review: ReviewDto | null) => {
            trip.review = review ?? null;
          },
          error: () => {
            trip.review = null;
          }
        });
      } else {
        trip.review = null;
      }
    });
  }

  selectViewTrip(tripId: number): void {
    this.router.navigate(['/trip/details', tripId]);
  }

  selectEditTrip(tripId: number): void {
    this.router.navigate(['/trip/edit', tripId]);
  }

  shareTrip(trip: TripWithOwnership): void {
    this.router.navigate(['/trip/share', trip.id], { state: { trip } });
  }

  saveTripEdits(tripId: number, updatedTrip: TripUpdateDto): void {
    this.tripService.updateTrip(tripId, updatedTrip).subscribe({
      next: () => {
        const index = this.displayedTrips.findIndex(t => t.id === updatedTrip.id);
        if (index > -1) this.displayedTrips[index] = { ...updatedTrip } as TripWithOwnership;
        this.selectedTrip = null;
      },
      error: err => console.error('Error updating trip:', err)
    });
  }

  cancelEdit(): void {
    this.selectedTrip = null;
  }

  deleteTrip(trip: TripWithOwnership): void {
    if (trip.id && confirm(`Are you sure you want to delete the trip "${trip.title}"?`)) {
      this.tripService.deleteTrip(trip.id).subscribe({
        next: () => {
          this.displayedTrips = this.displayedTrips.filter(t => t.id !== trip.id);
        },
        error: err => {
          console.error('Error deleting trip:', err);
          alert('Failed to delete the trip. Please try again.');
        }
      });
    }
  }

  openRatingModal(trip: TripDto): void {
    const dialogRef = this.dialog.open(Rate, {
      width: '400px',
      data: { tripId: trip.id }
    });

    dialogRef.afterClosed().subscribe((result: { rating: number; review: string }) => {
      if (result && trip.id) {
        const user = this.authService.getCurrentUser();

        const payload: ReviewDto = {
          tripId: trip.id,
          userId: user.id,
          rating: result.rating,
          review: result.review
        };

        this.rateService.submitRatingAndReview(payload).subscribe(() => {
          trip.review = payload; // Now review is the full ReviewDto
        });
      }
    });
  }

  goToChecklist(trip: TripWithOwnership): void {
    this.router.navigate(['/trip', trip.id, 'checklist']);
  }

  getExpensesLink(trip: TripWithOwnership): void {
    this.router.navigate(['/trip', trip.id, 'expenses']);
  }

  goToItinerary(trip: TripWithOwnership): void {
    this.router.navigate(['/trip', trip.id, 'itinerary']);
  }
}
