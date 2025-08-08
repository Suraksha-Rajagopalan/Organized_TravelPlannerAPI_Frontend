import { TripCreateDto } from './../../../../common/DTOs/Trip/TripCreateDto';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService } from '../../../../common/services/trip.service';
import { TripDto } from '../../../../common/DTOs/Trip/TripDto';

@Component({
  selector: 'app-trip-manager',
  standalone: false,
  templateUrl: './manager.html',
  styleUrl: './manager.css'
})
export class Manager {
  trips: TripDto[] = [];

  constructor(private tripService: TripService) {
    this.loadTrips();
  }

  loadTrips(): void {
    this.tripService.getTrips().subscribe({
      next: (data) => {this.trips = data;console.log(this.trips)},
      error: (err) => console.error('Error fetching trips:', err)
    });
  }

  onTripAdded(trip: TripDto) {
    this.tripService.addTrip(trip as TripCreateDto).subscribe({
      next: (newTrip) => {
        this.trips.push(newTrip);
      },
      error: (err) => console.error('Error adding trip:', err)
    });
  }
}
