import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rate-trip',
  standalone: false,
  templateUrl: './rate.html',
  styleUrls: ['./rate.css'],
})
export class Rate {
  rating: number = 0;
  reviewText: string = '';

  constructor(private dialogRef: MatDialogRef<Rate>) {}

  selectRating(star: number): void {
    this.rating = star;
  }

  onSubmit(): void {
    this.dialogRef.close({ rating: this.rating, review: this.reviewText });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
