import { ApplicationConfig, InjectionToken, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { reducers } from './core/store/app.reducer';
import { metaReducers } from './core/store/meta-reducers';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';

const firebaseConfig = {
  apiKey: "AIzaSyBdEm5D1pazT6hhprq0hQKUSm-n5_vz4Uk",
  authDomain: "trycircleup.firebaseapp.com",
  projectId: "trycircleup",
  storageBucket: "trycircleup.firebasestorage.app",
  messagingSenderId: "484192843057",
  appId: "1:484192843057:web:619e8cbc9d5872f08aac10",
  measurementId: "G-KDR408WJWG"
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
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideStore(reducers, { metaReducers })
  ]
};
