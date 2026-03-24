import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

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

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};
