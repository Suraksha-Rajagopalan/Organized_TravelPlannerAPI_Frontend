import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = () => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  const token = localStorage.getItem('jwtToken');

  if (token) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};