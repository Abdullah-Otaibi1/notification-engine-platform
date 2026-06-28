import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Route guard factory restricting access to the given roles. The backend is the
 * real authorization boundary; this keeps the UI consistent by hiding pages the
 * user cannot use. Unauthorized users are sent to the dashboard.
 */
export const roleGuard = (roles: string[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) return router.createUrlTree(['/auth/login']);

  const role = auth.role();
  return role && roles.includes(role) ? true : router.createUrlTree(['/dashboard']);
};
