import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  editing = false;
  

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
    const userData = localStorage.getItem('user');

    if (userData) {
      const loggedUser = JSON.parse(userData);

      this.user.username = loggedUser.username || '';
      this.user.email = loggedUser.email || '';
      //Loading any extra profile details
      const savedDetails = localStorage.getItem('userProfileDetails');
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
    const extras = {
      phone: this.user.phone,
      profileImage: this.user.profileImage,
      address: this.user.address,
      bio: this.user.bio
    };

    // Temporarily saving extended profile fields locally
    localStorage.setItem('userProfileDetails', JSON.stringify(extras));

    //  API call like this:
    // this.profileService.updateProfile(this.user).subscribe(...);

    console.log('Saved extended profile info:', extras);
    this.editing = false;
  }
}
