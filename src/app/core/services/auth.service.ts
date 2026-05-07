import { Injectable, signal, inject, computed } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { setGoogleDriveAccessToken } from '../features/auth';
import { Google_Drive_API_Url } from '../../app.config';
import { CommonData } from '../../shared/services/common-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private store = inject(Store<AppState>);
  private driveApiUrl = inject(Google_Drive_API_Url);
  private commonData = inject(CommonData);
  private user$ = user(this.auth); 
  readonly currentUser = toSignal(this.user$);
  readonly isAuthenticated = computed(() => !!this.currentUser());

  constructor() { }

  /* Triggers Google Login via Popup */
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope(this.driveApiUrl + 'auth/drive.file');

      const result = await signInWithPopup(this.auth, provider);

      // Extract Google OAuth Access Token for Drive API
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (token) {
        this.store.dispatch(setGoogleDriveAccessToken({ accessToken: token }));
      }

      return result.user;
    } catch (error) {
      throw error;
    }
  }

  /* * Logs the user out */
  async logout() {
    try {
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
