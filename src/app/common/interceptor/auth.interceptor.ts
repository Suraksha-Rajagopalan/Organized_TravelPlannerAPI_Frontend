import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const cookieService = inject(CookieService);

  const token = authService.getJwtToken();
  const excludedUrls = ['/signup', '/login', '/refresh'];
  const shouldExclude = excludedUrls.some(url => req.url.includes(url));

  const jwtExpiryStr = cookieService.get('jwtTokenExpiry');
  const jwtExpiry = jwtExpiryStr ? parseInt(jwtExpiryStr, 10) : null;
  const now = Date.now();

  // Helper: clone with Authorization header
  const addAuthHeader = (request: typeof req, tokenValue: string) =>
    request.clone({
      setHeaders: { Authorization: `Bearer ${tokenValue}` },
      withCredentials: true
    });

  // If excluded (like login/signup), just pass request through
  if (shouldExclude) {
    return next(req.clone({ withCredentials: true }));
  }

  // If no token at all, proceed without header
  if (!token) {
    return next(req);
  }

  // If token expiry is within 1 minute, refresh before proceeding
  if (jwtExpiry && jwtExpiry - now <= 60_000) {
    return authService.refreshToken().pipe(
      switchMap(refreshed => {
        const newToken = authService.getJwtToken();
        return next(addAuthHeader(req, newToken));
      }),
      catchError(err => {
        authService.logout();
        return throwError(() => new Error('Session expired. Please log in again.'));
      })
    );
  }

  // Otherwise, attach token and send request
  return next(addAuthHeader(req, token)).pipe(
    catchError(error => {
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const refreshedToken = authService.getJwtToken();
            return next(addAuthHeader(req, refreshedToken));
          }),
          catchError(() => {
            authService.logout();
            return throwError(() => new Error('Session expired. Please log in again.'));
          })
        );
      }
      return throwError(() => error);
    })
  );
};
