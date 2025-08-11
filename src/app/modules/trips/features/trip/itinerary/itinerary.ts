import { Component, inject, OnInit, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ItineraryService } from '../../../../../common/services/itinerary.service';
import { TripService } from '../../../../../common/services/trip.service';
import { AuthService } from '../../../../../common/services/auth.service';
import { ItineraryItemCreateDto } from '../../../../../common/DTOs/Itinerary/ItineraryItemCreateDto';
import { TripDto } from '../../../../../common/DTOs/Trip/TripDto';
import { Popup } from '../../../../../common/components/popup/popup';

@Component({
  standalone: false,
  selector: 'app-trip-itinerary',
  templateUrl: './itinerary.html',
  styleUrls: ['./itinerary.css']
})
export class Itinerary implements OnInit {
  private authService = inject(AuthService);
  private tripService = inject(TripService);

  @ViewChild('toastContainer', { read: ViewContainerRef }) toastContainer!: ViewContainerRef;

  tripId!: number;
  userId!: number;
  itinerary: ItineraryItemCreateDto[] = [];

  isOwner: boolean = false;
  hasEditAccess: boolean = false;
  accessChecked: boolean = false;

  formGroup: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    scheduledDateTime: new FormControl('', Validators.required)
  });

  editingItemId?: number;

  constructor(
    private itineraryService: ItineraryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const parsedId = Number(idParam);

    if (!idParam || isNaN(parsedId) || parsedId <= 0) {
      console.error('Invalid trip ID in route:', idParam);
      return;
    }

    this.tripId = parsedId;
    this.userId = this.authService.getUserId();

    this.loadTripAccess();
    this.loadItinerary();
  }

  private loadTripAccess(): void {
    this.tripService.getTrips().subscribe({
      next: (trips: TripDto[]) => {
        const trip = trips.find(t => t.id === this.tripId);
        if (trip) {
          this.isOwner = trip.userId === this.userId;
          this.hasEditAccess = (trip as any).accessLevel === 'Edit';
        } else {
          this.isOwner = false;
          this.hasEditAccess = false;
        }
        this.accessChecked = true;
      },
      error: (err: any) => {
        console.error('Failed to load trips for access check', err);
        this.isOwner = false;
        this.hasEditAccess = false;
        this.accessChecked = true;
      }
    });
  }

  private canEdit(): boolean {
    if (!this.accessChecked) {
      this.showToast('Checking permissions — please wait.');
      return false;
    }

    if (this.isOwner || this.hasEditAccess) {
      return true;
    }

    this.showToast('You do not have permission to modify this itinerary.');
    return false;
  }

  loadItinerary(): void {
    this.itineraryService.getItinerary(this.tripId).subscribe({
      next: (data: ItineraryItemCreateDto[]) => {
        this.itinerary = data;
      },
      error: (err) => {
        console.error('Failed to load itinerary', err);
        this.showToast('Failed to load itinerary.');
      }
    });
  }

  addItineraryItem(): void {
    if (this.formGroup.invalid) {
      this.showToast('Please complete the form.');
      return;
    }
    if (!this.canEdit()) return;

    const { title, description, scheduledDateTime } = this.formGroup.value;
    const isoDate = new Date(scheduledDateTime).toISOString();

    const item: ItineraryItemCreateDto = {
      title: title.trim(),
      description: description?.trim(),
      scheduledDateTime: isoDate
    };

    if (this.editingItemId) {
      item.id = this.editingItemId;

      this.itineraryService.updateItineraryItem(this.tripId, this.userId, this.editingItemId, item).subscribe({
        next: () => {
          this.loadItinerary();
          this.resetForm();
          this.showToast('Itinerary item updated.');
        },
        error: (err) => {
          console.error('Error updating itinerary item', err);
          this.showToast('Failed to update itinerary item.');
        }
      });
    } else {
      this.itineraryService.addItineraryItem(this.tripId, this.userId, item).subscribe({
        next: () => {
          this.loadItinerary();
          this.resetForm();
          this.showToast('Itinerary item added.');
        },
        error: (err) => {
          console.error('Error adding itinerary item', err);
          this.showToast('Failed to add itinerary item.');
        }
      });
    }
  }

  deleteItineraryItem(item: ItineraryItemCreateDto): void {
    if (!item.id) {
      console.error('Missing ID on itinerary item.');
      return;
    }
    if (!this.canEdit()) return;

    this.itineraryService.deleteItineraryItem(this.tripId, this.userId, item.id).subscribe({
      next: () => {
        this.loadItinerary();
        this.showToast('Itinerary item deleted.');
      },
      error: (err) => {
        console.error('Error deleting itinerary item', err);
        this.showToast('Failed to delete itinerary item.');
      }
    });
  }

  editItineraryItem(item: ItineraryItemCreateDto): void {
    if (!this.canEdit()) return;

    this.formGroup.setValue({
      title: item.title,
      description: item.description || '',
      scheduledDateTime: new Date(item.scheduledDateTime).toISOString().slice(0, 16)
    });
    this.editingItemId = item.id;
  }

  resetForm(): void {
    this.formGroup.reset();
    this.editingItemId = undefined;
  }

  private showToast(message: string): void {
    const toastRef: ComponentRef<Popup> = this.toastContainer.createComponent(Popup);
    toastRef.instance.message = message;
  }
}
