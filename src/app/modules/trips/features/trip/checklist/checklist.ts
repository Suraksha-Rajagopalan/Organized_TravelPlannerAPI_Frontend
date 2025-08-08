import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChecklistService } from '../../../../../common/services/checklist.service';
import { AuthService } from '../../../../../common/services/auth.service';
import { TripService } from '../../../../../common/services/trip.service';
import { ChecklistItemDto } from '../../../../../common/DTOs/Checklist/ChecklistItemDto';
import { ChecklistWithAccessDto } from '../../../../../common/DTOs/Checklist/ChecklistWithAccessDto';

@Component({
  standalone: false,
  selector: 'app-trip-checklist',
  templateUrl: './checklist.html',
})
export class Checklist implements OnInit {
  private checklistService = inject(ChecklistService);
  private authService = inject(AuthService);
  private tripService = inject(TripService)

  tripId!: number;
  userId!: number;
  checklist: ChecklistItemDto[] = [];
  newItemText: string = '';
  editingItemId: number | null = null;
  editedText: string = '';

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    this.tripId = idFromRoute ? Number(idFromRoute) : NaN;

    if (!this.tripId || isNaN(this.tripId)) {
      console.error('Invalid trip ID:', this.tripId);
      return;
    }

    this.userId = this.authService.getUserId();

    this.loadTripAndChecklist();
  }

  loadTripAndChecklist() {
    this.checklistService.getChecklist(this.tripId).subscribe((res: any) => {
      if (Array.isArray(res.items)) {
        this.checklist = res.items;
      } else {
        this.checklist = [];
      }
    });
  }




  addItem() {
    if (!this.newItemText.trim()) return;

    const newItem: ChecklistItemDto = {
      tripId: this.tripId,
      userId: this.userId,
      description: this.newItemText,
      isCompleted: false,
    };

    this.checklistService.addChecklistItem(newItem).subscribe(added => {
      this.checklist.push(added);
      this.newItemText = '';
    });
  }

  toggleComplete(item: ChecklistItemDto) {
    if (item.id == null) return;

    this.checklistService.toggleChecklistItem(item.id).subscribe(() => {
      item.isCompleted = !item.isCompleted;
    });
  }

  deleteItem(item: ChecklistItemDto) {
    if (item.id == null) return;

    this.checklistService.deleteChecklistItem(item.id).subscribe(() => {
      this.checklist = this.checklist.filter(i => i.id !== item.id);
    });
  }

  startEdit(item: ChecklistItemDto) {

    this.editingItemId = item.id!;
    this.editedText = item.description;
  }

  saveEdit(item: ChecklistItemDto) {
    if (!this.editedText.trim() || item.id == null) return;

    item.description = this.editedText;
    this.checklistService.updateChecklistItem(item.id, item).subscribe(() => {
      this.editingItemId = null;
    });
  }

  cancelEdit() {
    this.editingItemId = null;
  }
}
