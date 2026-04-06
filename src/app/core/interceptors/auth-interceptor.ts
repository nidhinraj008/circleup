import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectGoogleDriveAccessToken } from '../features/auth';
import { Google_Drive_API_Url } from '../../app.config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const googleDriveAPIUrl = inject(Google_Drive_API_Url);
  const store = inject(Store);
  const token = store.selectSignal(selectGoogleDriveAccessToken)();

  if (req.url.startsWith(googleDriveAPIUrl) && token) {    
    const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next(cloned);
  }

  return next(req);
};
