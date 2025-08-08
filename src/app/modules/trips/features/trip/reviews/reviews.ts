import { Component } from '@angular/core';
import { ReviewsService } from '../../../../../common/services/reviews.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trip-reviews',
  standalone: false,
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.css'],
})
export class Reviews {
  searchQuery: string = '';
  reviews: any[] = [];
  loading = false;

  constructor(private reviewService: ReviewsService, private router: Router) {}

  searchReviews(): void {
    if (!this.searchQuery.trim()) {
      console.warn('Search query is empty.');
      return;
    }

    console.log('Searching for trip reviews with destination:', this.searchQuery);

    this.loading = true;
    this.reviewService.searchTripReviews(this.searchQuery).subscribe({
      next: (data) => {
        console.log('Received reviews from API:', data);
        this.reviews = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
        this.reviews = [];
        this.loading = false;
      }
    });
  }

  viewTripPlan(tripId: number): void {
    console.log('Navigating to trip details for tripId:', tripId);
    this.router.navigate(['/trip/details', tripId]);
  }
}
