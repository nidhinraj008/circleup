import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Google_Drive_API_Url } from '../../app.config';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { setGoogleDriveAccessToken } from '../../core/features/auth';
import { map, switchMap, Observable, Subscriber } from 'rxjs';
import { credentials } from '../data/app-info';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleDriveService {

  baseUrl = inject(Google_Drive_API_Url);
  tokenClient: any;

  constructor(private http: HttpClient,
    private store: Store<AppState>
  ) { }

  public initClient() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: credentials.clientID,
      scope: this.baseUrl + 'auth/drive.file',
      callback: (resp: any) => {
        this.store.dispatch(setGoogleDriveAccessToken({ accessToken: resp.access_token }));
      }
    });
  }

  public login() {
    this.tokenClient.requestAccessToken();
  }

  public refreshTokenSilently(): Observable<string> {
    return new Observable((observer: Subscriber<string>) => {
      if (!this.tokenClient) {
        this.initClient();
      }
      // Override the callback for this specific request
      this.tokenClient.callback = (resp: any) => {
        if (resp.error) {
          observer.error(resp.error);
        } else {
          this.store.dispatch(setGoogleDriveAccessToken({ accessToken: resp.access_token }));
          observer.next(resp.access_token);
          observer.complete();
        }
      };
      // Request without prompting the user (relies on active Google session)
      this.tokenClient.requestAccessToken({ prompt: 'none' });
    });
  }

  /* search for the folder in the parent repository */
  public searchFolder() {
    const query = `name='${credentials.fileUploadFolder}' and mimeType='${credentials.folderMimeType}' and 'root' in parents and trashed=false`;
    return this.http.get(this.baseUrl + 'drive/v3/files?q=' + encodeURIComponent(query) + '&fields=files(id,name)');
  }

  /* create folder in root directory */
  public createFolder() {
    const params = {
      name: credentials.fileUploadFolder,
      mimeType: credentials.folderMimeType
    }
    return this.http.post(this.baseUrl + 'drive/v3/files', params);
  }

  /* upload files to drive */
  public uploadFile(file: File, folderId: string) {
    const formData = new FormData();
    const metadata = {
      name: file.name,
      mimeType: file.type,
      parents: [folderId]
    };
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);
    return this.http.post(this.baseUrl + 'upload/drive/v3/files?uploadType=multipart', formData);
  }

  /* makes the file public */
  private makeFilePublic(fileId: string) {
    const params = {
      role: 'reader',
      type: 'anyone'
    }
    return this.http.post(`${this.baseUrl}drive/v3/files/${fileId}/permissions`, params);
  }

  /* uploadFile() & makeFilePublic() */
  public uploadAsPublicFile(file: File, folderId: string) {
    return this.uploadFile(file, folderId).pipe(
      switchMap((res: any) =>
        this.makeFilePublic(res.id).pipe(
          map(() => `${credentials.imageBasePath}${res.id}`)
        )
      )
    );
  }
} 
