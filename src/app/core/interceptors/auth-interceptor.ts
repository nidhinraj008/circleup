import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectGoogleDriveAccessToken } from '../features/auth';
import { Google_Drive_API_Url } from '../../app.config';
import { catchError, switchMap, throwError } from 'rxjs';
import { GoogleDriveService } from '../../shared/services/google-drive.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const googleDriveAPIUrl = inject(Google_Drive_API_Url);
  if (!req.url.startsWith(googleDriveAPIUrl))
    return next(req);

  const store = inject(Store);
  const injector = inject(Injector);
  const token = store.selectSignal(selectGoogleDriveAccessToken)();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401)
        return throwError(() => error);

      const googleDriveService = injector.get(GoogleDriveService);
      return googleDriveService.refreshTokenSilently().pipe(
        switchMap((newToken) => {
          if (!newToken)
            return throwError(() => error);

          const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
          return next(retryReq);
        }),
        catchError((refreshErr) => {
          return throwError(() => refreshErr);
        })
      );
    })
  );
};
