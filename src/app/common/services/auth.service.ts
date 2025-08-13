import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { LoginRequestDto } from '../DTOs/Auth/LoginRequestDto';
import { AuthResponseDto } from '../DTOs/Auth/AuthResponseDto';
import { SignupRequest } from '../DTOs/Auth/SignupRequest';
import { TokenRefreshRequestDto } from '../DTOs/Auth/TokenRefreshRequestDto';
import { ApiResponse, LoginResponseDto } from '../DTOs/Auth/LoginResponseDto';
import { SignupResponseDto } from '../DTOs/Auth/SignupResponseDto';
import { environment } from '../../../environments/environment.development';
import { UpdateProfileDto } from '../DTOs/Auth/UpdateProfileDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<any>;
  public user$: Observable<any>;
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    const storedUser = this.getUserFromCookies();
    this.userSubject = new BehaviorSubject<any>(storedUser);
    this.user$ = this.userSubject.asObservable();
  }

  login(email: string, password: string): Observable<LoginResponseDto> {
  return this.http.post<ApiResponse<LoginResponseDto>>(
    `${this.apiUrl}/Auth/login`,
    { email, password }
  ).pipe(
    map(response => response.result), // Extract result only
    catchError(error => {
      console.error('Login failed:', error);
      return throwError(() => new Error('Login failed. Please check your credentials.'));
    })
  );
}

updateProfile(payload: UpdateProfileDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/Auth/update-profile`, payload);
  }


  signup(Name: string, Email: string, Password: string): Observable<SignupResponseDto> {
    const body = { Name, Email, Password };
    return this.http.post<SignupResponseDto>(`${this.apiUrl}/Auth/signup`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(error => {
        console.log(Name, Email, Password);
        console.error('Signup failed:', error);
        return throwError(() => new Error('Signup failed. Please try again later.'));
      })
    );
  }


  refreshToken(): Observable<LoginResponseDto> {
    const accessToken = this.cookieService.get('jwtToken');
    const refreshDto: TokenRefreshRequestDto = {
      accessToken,
      refreshToken: ''
    };

    return this.http.post<LoginResponseDto>(`${this.apiUrl}/Auth/refresh`, refreshDto, {
      withCredentials: true
    }).pipe(
      map(response => {
        this.setUser(response.user, response.accessToken, response.refreshToken);
        return response;
      }),
      catchError(error => {
        console.error('Token refresh failed:', error);
        return throwError(() => new Error('Session expired. Please log in again.'));
      })
    );
  }


  getAccessToken(): string | null {
    return localStorage.getItem('jwtToken') || null;
  }

  logout(): void {
    this.cookieService.delete('user');
    this.cookieService.delete('jwtToken');
    this.cookieService.delete('refreshToken');
    this.userSubject.next(null);
  }

  getCurrentUser(): any {
    return this.userSubject.value;
  }

  getUserId(): number {
    const user = this.getCurrentUser();
    return user?.id ? Number(user.id) : 0;
  }

  setUser(user: any, token: string, refreshToken: string): void {
    const expires = 7; // 7 days
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  getJwtToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  private getUserFromCookies(): any {
    try {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      console.warn('Failed to parse user from cookies:', e);
      return null;
    }
  }
}
