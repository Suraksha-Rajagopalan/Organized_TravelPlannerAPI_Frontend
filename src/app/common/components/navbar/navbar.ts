import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Navbar implements OnInit {
  username: string = '';
  isLoggedIn: boolean = false;
  user: any = null;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.isLoggedIn = !!user;
      this.username = user?.username || '';
    });
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  onLoginButtonClick(): void {
    this.router.navigate(['/auth/login']);
  }

  ViewProfile(): void {
    this.router.navigate(['/auth/profile']);
  }

  TripCreation(): void {
    this.router.navigate(['/user/form']);
  }

  goToTripReviews(): void {
    this.router.navigate(['/trip/reviews']);
  }

  goToHome(): void {
    this.router.navigate(['/users/dashboard']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin/homepage']);
  }
}
