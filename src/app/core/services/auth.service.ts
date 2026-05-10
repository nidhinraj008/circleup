import { Injectable, inject, computed } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signInWithCredential, signOut, user } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { setGoogleDriveAccessToken } from '../store/auth';
import { Google_Drive_API_Url } from '../../app.config';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private store = inject(Store<AppState>);
  private driveApiUrl = inject(Google_Drive_API_Url);
  private user$ = user(this.auth);
  readonly currentUser = toSignal(this.user$);
  readonly isAuthenticated = computed(() => !!this.currentUser());

  constructor() { }

  /* Triggers Google Login */
  async loginWithGoogle() {
    try {
      if (Capacitor.isNativePlatform()) {
        // Native: Use Capacitor Firebase Auth plugin for native Google Sign-In
        const result = await FirebaseAuthentication.signInWithGoogle();
        const idToken = result.credential?.idToken;

        if (idToken) {
          // Sign in on the web layer using the native id token
          const credential = GoogleAuthProvider.credential(idToken);
          const userCredential = await signInWithCredential(this.auth, credential);

          // Extract access token if available
          const accessToken = result.credential?.accessToken;
          if (accessToken) {
            this.store.dispatch(setGoogleDriveAccessToken({ accessToken }));
          }

          return userCredential.user;
        }
        throw new Error('No ID Token received from native sign-in');
      } else {
        // Web: Use Firebase popup
        const provider = new GoogleAuthProvider();
        provider.addScope(this.driveApiUrl + 'auth/drive.file');
        provider.addScope('profile');
        provider.addScope('email');

        const result = await signInWithPopup(this.auth, provider);

        // Extract Google OAuth Access Token for Drive API
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        if (token) {
          this.store.dispatch(setGoogleDriveAccessToken({ accessToken: token }));
        }

        return result.user;
      }
    } catch (error) {
      throw error;
    }
  }

  /* Logs the user out */
  async logout() {
    try {
      if (Capacitor.isNativePlatform()) {
        await FirebaseAuthentication.signOut();
      }
      await signOut(this.auth);
      this.store.dispatch(setGoogleDriveAccessToken({ accessToken: '' }));
    } catch (error) {
      throw error;
    }
  }

  /* Retrieves the Firebase ID Token */
  async getIdToken(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  }
}
