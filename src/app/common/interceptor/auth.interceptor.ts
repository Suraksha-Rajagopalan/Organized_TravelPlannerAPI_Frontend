import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';

let refreshInProgress = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  const token = authService.getJwtToken();
  const excludedUrls = ['/signup', '/login', '/refresh'];
  const shouldExclude = excludedUrls.some(url => req.url.includes(url));

  // Read expiry directly from localStorage (set during login/refresh)
  const jwtExpiryStr = localStorage.getItem('accessExpiry');
  const jwtExpiry = jwtExpiryStr ? parseInt(jwtExpiryStr, 10) : null;
  const now = Date.now();

  const addAuthHeader = (request: HttpRequest<unknown>, tokenValue: string) =>
    request.clone({
      setHeaders: { Authorization: `Bearer ${tokenValue}` }
    });

  if (shouldExclude) {
    return next(req);
  }

  // If no token, just forward the request without Authorization
  if (!token) {
    return next(req);
  }

  // If token is expiring in <= 1 min, refresh before proceeding
  if (jwtExpiry && jwtExpiry - now <= 60_000) {
    return performRefresh(authService, req, next, addAuthHeader);
  }

  // Otherwise, attach token normally
  return next(addAuthHeader(req, token)).pipe(
    catchError(error => {
      if ((error as any)?.status === 401) {
        return performRefresh(authService, req, next, addAuthHeader);
      }
      return throwError(() => error);
    })
  );
};

function performRefresh(
  authService: AuthService,
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  addAuthHeader: (r: HttpRequest<unknown>, token: string) => HttpRequest<unknown>
): Observable<HttpEvent<unknown>> {
  if (!refreshInProgress) {
    refreshInProgress = true;
    refreshSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(response => {
        refreshInProgress = false;
        const newToken = response.accessToken;
        refreshSubject.next(newToken ?? null);

        if (!newToken) {
          authService.logout();
          return throwError(() => new Error('Refresh failed, no token returned'));
        }
        return next(addAuthHeader(req, newToken));
      }),
      catchError(err => {
        refreshInProgress = false;
        refreshSubject.next(null);
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    // Wait for the ongoing refresh to complete
    return refreshSubject.pipe(
      filter((t): t is string => typeof t === 'string' && t.length > 0),
      take(1),
      switchMap(newToken => next(addAuthHeader(req, newToken)))
    );
  }
}
