import { ApplicationConfig, InjectionToken, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

/* store imports */
import { provideStore } from '@ngrx/store';
import { reducers } from './core/store/app.reducer';
import { metaReducers } from './core/store/meta-reducers';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const firebaseConfig = {
  apiKey: "AIzaSyDwIyU33ABgYDcQCIB82S9KJDsrbE5pAMo",
  authDomain: "notifications-d7fc6.firebaseapp.com",
  databaseURL: "https://notifications-d7fc6-default-rtdb.firebaseio.com",
  projectId: "notifications-d7fc6",
  storageBucket: "notifications-d7fc6.firebasestorage.app",
  messagingSenderId: "375661429566",
  appId: "1:375661429566:web:7b869e8a90df1e1304a26f",
  measurementId: "G-X5QXE7N0W6"
};

export const Google_Drive_API_Url = new InjectionToken<string>('Google Drive API Url', {
  providedIn: 'root',
  factory: () => 'https://www.googleapis.com/'
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),

    provideStore(reducers, { metaReducers })
  ]
};
