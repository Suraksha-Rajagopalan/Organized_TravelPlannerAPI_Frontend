import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChecklistService } from '../../../../../common/services/checklist.service';
import { AuthService } from '../../../../../common/services/auth.service';
import { TripService } from '../../../../../common/services/trip.service';
import { ChecklistItemDto } from '../../../../../common/DTOs/Checklist/ChecklistItemDto';
import { TripDto } from '../../../../../common/DTOs/Trip/TripDto'; // adjust if path differs

@Component({
  standalone: false,
  selector: 'app-trip-checklist',
  templateUrl: './checklist.html',
})
export class Checklist implements OnInit {
  private checklistService = inject(ChecklistService);
  private authService = inject(AuthService);
  private tripService = inject(TripService);

  tripId!: number;
  userId!: number;
  checklist: ChecklistItemDto[] = [];
  newItemText: string = '';
  editingItemId: number | null = null;
  editedText: string = '';

  // Access control flags
  isOwner: boolean = false;
  hasEditAccess: boolean = false;
  accessChecked: boolean = false;

  // Popup control (we will not modify the Popup component)
  popupMessage: string = '';
  popupVisible: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    this.tripId = idFromRoute ? Number(idFromRoute) : NaN;

    if (!this.tripId || isNaN(this.tripId)) {
      console.error('Invalid trip ID:', this.tripId);
      return;
    }

    this.userId = this.authService.getUserId();

    // Determine access and load checklist
    this.loadTripAccess();
    this.loadTripAndChecklist();
  }

  private loadTripAccess(): void {
    this.tripService.getTrips().subscribe({
      next: (trips: TripDto[]) => {
        const trip = trips.find(t => t.id === this.tripId);
        if (trip) {
          this.isOwner = trip.userId === this.userId;
          // keep same access field name you've used elsewhere
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

  loadTripAndChecklist(): void {
    this.checklistService.getChecklist(this.tripId).subscribe((res: any) => {
      if (Array.isArray(res?.items)) {
        this.checklist = res.items;
      } else {
        this.checklist = [];
      }
    }, (err: any) => {
      console.error('Failed to load checklist', err);
      this.checklist = [];
    });
  }

  private showPopup(message: string) {
    this.popupMessage = message;
    this.popupVisible = true;
    // note: Popup component handles its internal `visible` and close UI;
    // we keep *ngIf here to create/destroy the popup component as needed
  }

  private canEdit(): boolean {
    // Block until we've checked access to avoid races
    if (!this.accessChecked) {
      this.showPopup('Checking permissions — please wait.');
      return false;
    }

    if (this.isOwner || this.hasEditAccess) {
      return true;
    }

    this.showPopup('You do not have permission to modify this checklist.');
    return false;
  }

  addItem() {
    if (!this.newItemText.trim()) return;
    if (!this.canEdit()) return;

    const newItem: ChecklistItemDto = {
      tripId: this.tripId,
      userId: this.userId,
      description: this.newItemText,
      isCompleted: false,
    };

    this.checklistService.addChecklistItem(newItem).subscribe({
      next: (added: ChecklistItemDto) => {
        this.checklist.push(added);
        this.newItemText = '';
        this.showPopup('Added Successfully')
      },
      error: (err: any) => {
        console.error('addItem failed', err);
        this.showPopup('Failed to add item. Try again later.');
      }
    });
  }

  toggleComplete(item: ChecklistItemDto) {
    if (item.id == null) return;
    if (!this.canEdit()) return;

    this.checklistService.toggleChecklistItem(item.id).subscribe({
      next: () => {
        item.isCompleted = !item.isCompleted;
      },
      error: (err: any) => {
        console.error('toggleComplete failed', err);
        this.showPopup('Failed to update item. Try again later.');
      }
    });
  }

  deleteItem(item: ChecklistItemDto) {
    if (item.id == null) return;
    if (!this.canEdit()) return;

    this.checklistService.deleteChecklistItem(item.id).subscribe({
      next: () => {
        this.checklist = this.checklist.filter(i => i.id !== item.id);
      },
      error: (err: any) => {
        console.error('deleteItem failed', err);
        this.showPopup('Failed to delete item. Try again later.');
      }
    });
  }

  startEdit(item: ChecklistItemDto) {
    if (!this.canEdit()) return;
    this.editingItemId = item.id!;
    this.editedText = item.description;
  }

  saveEdit(item: ChecklistItemDto) {
    if (!this.editedText.trim() || item.id == null) return;
    if (!this.canEdit()) return;

    item.description = this.editedText;
    this.checklistService.updateChecklistItem(item.id, item).subscribe({
      next: () => {
        this.editingItemId = null;
      },
      error: (err: any) => {
        console.error('saveEdit failed', err);
        this.showPopup('Failed to save changes. Try again later.');
      }
    });
  }

  cancelEdit() {
    this.editingItemId = null;
  }
}
