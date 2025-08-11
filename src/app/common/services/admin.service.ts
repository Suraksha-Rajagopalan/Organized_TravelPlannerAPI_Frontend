import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdminUserDto } from '../DTOs/Admin/AdminUserDto';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private baseUrl = 'http://localhost:5276/api/v1/Admin';
    users: AdminUserDto[] = [];

    constructor(private http: HttpClient) { }

    fetchUsers(): Observable<AdminUserDto[]> {
        return this.http.get<any>(`${this.baseUrl}/users`).pipe(
            map(response => response.result),
            catchError(error => {
                console.error('Error fetching admin users:', error);
                return throwError(() => new Error('Error fetching users'));
            })
        );
    }


    deleteUser(id: number): Observable<any> {
        const params = new HttpParams().set('id', id.toString());
        return this.http.delete<any>(`${this.baseUrl}/delete-user/${id}`,
            { params }).pipe(
            map(response => response.result),
            catchError(err => {
                console.error('Delete failed:', err);
                return throwError(() => new Error('Delete failed'));
            })
        );
    }

}