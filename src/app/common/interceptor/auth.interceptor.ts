import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getJwtToken();

  const excludedUrls = ['/signup', '/login'];
  const shouldExclude = excludedUrls.some(url => req.url.includes(url));

  let authReq = req;

  if (!shouldExclude && token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true // only include withCredentials for authenticated endpoints
    });
  } else {
    authReq = req.clone(); // REMOVE withCredentials here
  }

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401 && !req.url.includes('/refresh')) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const refreshedToken = authService.getJwtToken();
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${refreshedToken}`
              },
              withCredentials: true
            });
            return next(retryReq);
          }),
          catchError(() => {
            authService.logout();
            return throwError(() => new Error('Session expired. Please login again.'));
          })
        );
      }

      return throwError(() => error);
    })
  );
};
