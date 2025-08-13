import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { TripDto } from '../../../common/DTOs/Trip/TripDto';
import { TripService } from '../../../common/services/trip.service';
import { AuthService } from '../../../common/services/auth.service';
import { ShareService } from '../../../common/services/share.service';
import { TripWithAccessDto } from '../../../common/DTOs/Trip/TripWithAccessDto';
import { TripWithOwnership } from '../../../common/DTOs/Trip/TripWithOwnershipDto';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  // My Trips (paginated)
  trips: TripDto[] = [];
  pageNumber: number = 1;
  pageSize: number = 6;
  totalPages: number = 0;

  // Shared Trips
  sharedTrips: TripDto[] = [];

  // loading / error
  loading = true;
  errorMessage = '';

  private destroy$ = new Subject<void>();
  currentUser: any;
  username: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private tripService: TripService,
    private router: Router,
    private authService: AuthService,
    private shareService: ShareService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.username = user.username;
        this.isLoggedIn = true;
        this.loadMyTrips();
      }
    });
  }

  loadMyTrips(): void {
    this.loading = true;
    this.tripService.getPaginatedTrips(this.pageNumber, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.trips = res.items
            .slice() // copy to avoid mutating original
            .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));

          this.totalPages = res.totalPages ?? 0;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load trips.';
          this.loading = false;
        }
      });
  }

  // For pagination buttons
  onMyTripsPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageNumber = page;
      this.loadMyTrips();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



  // Card click from TripListComponent
  myTripSelected(event: { action: 'view' | 'edit'; trip: TripWithOwnership }): void {
    if (event.action === 'view') {
      this.router.navigate(['/trip/details', event.trip.id]);
    } else {
      this.router.navigate(['/trip/edit', event.trip.id]);
    }
  }

  // Click from SampleTripsComponent
  onTripSelected(trip: TripWithOwnership): void {
    this.router.navigate(['/trip/details', trip.id]);
  }
}
