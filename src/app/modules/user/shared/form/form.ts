import { Component, EventEmitter, Output } from '@angular/core';
import { TripDto } from '../../../../common/DTOs/Trip/TripDto';
import { TripService } from '../../../../common/services/trip.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../common/services/auth.service';
import { Router } from '@angular/router';
import { TripCreateDto } from '../../../../common/DTOs/Trip/TripCreateDto';


@Component({
  selector: 'app-trip-form',
  templateUrl: './form.html',
  standalone: false
})
export class Form {
  @Output() tripAdded = new EventEmitter<TripDto>();
  
  trip: TripCreateDto = {
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 0,
    travelMode: '',
    duration: '',
    bestTime: '',
    description: '',
    image: '',
    notes: '',
    userId: 0, 
    budgetDetails: {
      food: 0,
      hotel: 0,
    },
    essentials: [] as string[],
    touristSpots: [] as string[],
  };

  constructor(private tripService: TripService, 
    private authService: AuthService, 
    private router: Router) {}

  addEssential() {
    this.trip.essentials.push('');
  }

  removeEssential(index: number) {
    this.trip.essentials.splice(index, 1);
  }

  addTouristSpot() {
    this.trip.touristSpots.push('');
  }

  removeTouristSpot(index: number) {
    this.trip.touristSpots.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }


  onSubmit() {

    // Set the userId from AuthService before submitting
    console.log('Token before submit:', localStorage.getItem('token'));
    this.trip.userId = this.authService.getUserId();

    this.tripService.addTrip(this.trip).subscribe({
      next: (newTrip) => {
        this.tripAdded.emit(newTrip);
        this.trip = {
          title: '',
          destination: '',
          startDate: '',
          endDate: '',
          budget: 0,
          travelMode: '',
          duration: '',
          bestTime: '',
          description: '',
          image: '',
          notes: '',
          userId: this.authService.getUserId(),
          budgetDetails: {
            food: 0,
            hotel: 0,
          },
          essentials: [''],
          touristSpots: [''],
        };
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error creating trip:', err);
      },
    });
  }
}
