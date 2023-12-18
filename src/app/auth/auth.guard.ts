import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // return authService.user.pipe(
  //   map((user) => !!user),
  //   tap((isAuth) => {
  //     if (!isAuth) {
  //       router.navigate(['/auth']);
  //     }
  //   })
  // );

  return authService.user.pipe(
    take(1),
    map((user) => {
      const isAuth = !!user;

      if (!isAuth) {
        return router.createUrlTree(['/auth']);
      }

      return true;
    })
  );
};
