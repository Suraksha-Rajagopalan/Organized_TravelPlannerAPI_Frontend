import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../common/services/admin.service';
import { AdminUserDto } from '../../../common/DTOs/Admin/AdminUserDto';


@Component({
  selector: 'app-admin-homepage',
  standalone: false,
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css']
})
export class Homepage implements OnInit {
  users: AdminUserDto[] = [];
  selectedUser: AdminUserDto | null = null;

  constructor(private http: HttpClient, private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.fetchUsers().subscribe({
      next: (data: AdminUserDto[]) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  viewDetails(user: AdminUserDto): void {
    this.selectedUser = user;
  }

  closeDetails(): void {
    this.selectedUser = null;
  }

  removeUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== userId);
        },
        error: err => {
          console.error('Failed to delete user', err);
          alert('Failed to delete user.');
        }
      });
    }
  }

}
