import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TripUpdateDto } from '../../../../../common/DTOs/Trip/TripUpdateDto';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../../../../../common/services/trip.service';

@Component({
  selector: 'app-trip-edit',
  standalone: false,
  templateUrl: './edit.html',
  styleUrls: ['./edit.css'],
})
export class Edit implements OnInit {
  @Input() trip!: TripUpdateDto;
  @Output() save = new EventEmitter<TripUpdateDto>();
  @Output() cancel = new EventEmitter<void>();
  tripForm!: FormGroup;
  tripId: any;

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tripService.getTripByIdFromBackend(id).subscribe((tripData) => {
      this.trip = {
        ...tripData,
        essentials: tripData.essentials ?? [],
        touristSpots: tripData.touristSpots ?? [] // fallback to empty array if null
      };
      this.initializeForm();
    });
  }

  private formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  }

  initializeForm(): void {
    this.tripForm = this.fb.group({
      title: [this.trip.title],
      destination: [this.trip.destination],
      startDate: [this.formatDate(this.trip.startDate)],
      endDate: [this.formatDate(this.trip.endDate)],
      budget: [this.trip.budget],
      travelMode: [this.trip.travelMode],
      notes: [this.trip.notes],
      duration: [this.trip.duration],
      bestTime: [this.trip.bestTime],
      image: [this.trip.image],
      description: [this.trip.description],
      userId: [this.trip.userId],
      essentials: [this.trip.essentials],
      touristSpots: [this.trip.touristSpots],
      budgetDetails: this.fb.group({
        food: [this.trip.budgetDetails?.food || 0],
        hotel: [this.trip.budgetDetails?.hotel || 0],
      }),
    });
  }

  addEssential() {
    const essentials = [...this.tripForm.get('essentials')?.value || []];
    essentials.push('');
    this.tripForm.patchValue({ essentials });
  }

  removeEssential(index: number) {
    const essentials = [...this.tripForm.get('essentials')?.value || []];
    essentials.splice(index, 1);
    this.tripForm.patchValue({ essentials });
  }

  onEssentialChange(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    const essentials = [...this.tripForm.get('essentials')?.value || []];
    essentials[index] = target.value;
    this.tripForm.patchValue({ essentials });
  }

  addTouristSpot() {
    const spots = [...this.tripForm.get('touristSpots')?.value || []];
    spots.push('');
    this.tripForm.patchValue({ touristSpots: spots });
  }

  removeTouristSpot(index: number) {
    const spots = [...this.tripForm.get('touristSpots')?.value || []];
    spots.splice(index, 1);
    this.tripForm.patchValue({ touristSpots: spots });
  }

  onTouristSpotChange(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    const spots = [...this.tripForm.get('touristSpots')?.value || []];
    spots[index] = target.value;
    this.tripForm.patchValue({ touristSpots: spots });
  }

  onSubmit() {
    const updatedTrip: TripUpdateDto = this.tripForm.value;
    updatedTrip.id = this.trip.id;
    updatedTrip.userId = this.trip.userId;

    this.tripService.updateTrip(this.trip.id, updatedTrip).subscribe({
      next: (response) => {
        console.log('Trip updated successfully:', response);
        this.router.navigate(['/user/dashboard']);
      },
      error: (error) => {
        console.error('Error updating trip:', error);
      }
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}
