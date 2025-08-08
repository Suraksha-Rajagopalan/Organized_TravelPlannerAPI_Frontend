import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../../../../../common/services/trip.service';
import { ShareService } from '../../../../../common/services/share.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-share',
  templateUrl: './share.html',
  standalone: false
})
export class Share implements OnInit {
  shareForm!: FormGroup;
  tripId!: number;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tripService: TripService,
    private router: Router,
    private shareService: ShareService
  ) {}

  ngOnInit(): void {
    const tripIdParam = this.route.snapshot.paramMap.get('id');
    if (tripIdParam) {
      this.tripId = +tripIdParam;
    } else {
      alert('Trip ID not found.');
      this.router.navigate(['/user/dashboard']);
      return;
    }

    this.shareForm = this.fb.group({
      tripId: [this.tripId],
      sharedWithEmail: ['', [Validators.required, Validators.email]],
      accessLevel: ['View', Validators.required]
    });
  }

  shareTrip(): void {
    if (this.shareForm.valid) {
      this.submitting = true;

      this.shareService.shareTrip(this.shareForm.value).subscribe({
        next: () => {
          alert('Trip shared successfully!');
          this.router.navigate(['/user/dashboard']);
        },
        error: err => {
          alert(err.error || 'Failed to share trip.');
          this.submitting = false;
        }
      });
    }
  }
}
