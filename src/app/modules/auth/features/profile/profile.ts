import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../../common/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  editing = false;

  constructor(private cookieService: CookieService,
    private authService: AuthService
  ) { }
  // Fields to show/update
  user = {
    username: '',
    email: '',
    phone: '',
    profileImage: '',
    address: '',
    bio: ''
  };

  defaultImage: string = "https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg";
  ngOnInit(): void {
    const userData = this.cookieService.get('user');

    if (userData) {
      const loggedUser = JSON.parse(userData);

      this.user.username = loggedUser.username || '';
      this.user.email = loggedUser.email || '';
      //Loading any extra profile details
      const savedDetails = this.cookieService.get('userProfileDetails');
      if (savedDetails) {
        const extras = JSON.parse(savedDetails);
        this.user = { ...this.user, ...extras };
      }
    }
  }

  editProfile(): void {
    this.editing = true;
  }

  cancelEdit(): void {
    this.editing = false;
  }

  saveProfile(): void {
    const payload = {
      username: this.user.username,
      email: this.user.email,
      phone: this.user.phone,
      profileImage: this.user.profileImage,
      address: this.user.address,
      bio: this.user.bio
    };

    this.authService.updateProfile(payload).subscribe({
      next: (res) => {
        console.log('Saved to DB:', res);
        // update localStorage so UI stays consistent
        this.cookieService.set('userProfileDetails', JSON.stringify(payload));
        // if API returns updated user, update localStorage user object too
        if (res?.user) {
          const storedUser = JSON.parse(this.cookieService.get('user') ?? '{}');
          this.cookieService.set('user', JSON.stringify({ ...storedUser, ...res.user }));
        }
        this.editing = false;
      },
      error: (err) => {
        console.error('Error updating profile', err);
      }
    });
  }
}
