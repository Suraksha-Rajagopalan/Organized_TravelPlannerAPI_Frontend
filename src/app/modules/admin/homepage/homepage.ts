import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../common/services/admin.service';
import { AdminUserDto } from '../../../common/DTOs/Admin/AdminUserDto';
import { Popup } from '../../../common/components/popup/popup';


@Component({
  selector: 'app-admin-homepage',
  standalone: false,
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css']
})
export class Homepage implements OnInit {

  @ViewChild('toastContainer', { read: ViewContainerRef }) toastContainer!: ViewContainerRef;

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
          this.showToast('User Successfully Deleted');
        },
        error: err => {
          //console.error('Failed to delete user', err);
          //alert('Failed to delete user.');
        }
      });
    }
  }

  showToast(message: string) {
    if (!this.toastContainer) {
      console.warn('toastContainer not ready');
      return;
    }
    const toastRef: ComponentRef<Popup> = this.toastContainer.createComponent(Popup);
    toastRef.instance.message = message;

    // Destroy after 3s
    setTimeout(() => {
      toastRef.destroy();
    }, 3000);
  }


}
