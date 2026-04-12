import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Google_Drive_API_Url } from '../../app.config';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { setGoogleDriveAccessToken } from '../../core/features/auth';
import { map, switchMap } from 'rxjs';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleDriveService {

  private credentials = {
    clientID: "456334548529-lo5r9o4n2umo823tgqkh4ji7g3urjjlt.apps.googleusercontent.com",
    fileUploadFolder: "Circle Up",
    folderMimeType: "application/vnd.google-apps.folder",
    // imagaBasePath: "https://drive.google.com/uc?id="
    imagaBasePath: "https://lh3.googleusercontent.com/d/"
  }
  baseUrl = inject(Google_Drive_API_Url);

  tokenClient: any;

  constructor(private http: HttpClient,
    private store: Store<AppState>
  ) { }

  public initClient() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.credentials.clientID,
      scope: this.baseUrl + 'auth/drive.file',
      callback: (resp: any) => {
        this.store.dispatch(setGoogleDriveAccessToken({ accessToken: resp.access_token }));
      }
    });
  }

  login() {
    this.tokenClient.requestAccessToken();
  }

  /* search for the folder in the parent repository */
  public searchFolder() {
    const query = `name='${this.credentials.fileUploadFolder}' and mimeType='${this.credentials.folderMimeType}' and 'root' in parents and trashed=false`;
    return this.http.get(this.baseUrl + 'drive/v3/files?q=' + encodeURIComponent(query) + '&fields=files(id,name)');
  }

  /* create folder in root directory */
  public createFolder() {
    const params = {
      name: this.credentials.fileUploadFolder,
      mimeType: this.credentials.folderMimeType
    }
    return this.http.post( this.baseUrl + 'drive/v3/files', params);
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
    return this.http.post(this.baseUrl + 'upload/drive/v3/files?uploadType=multipart',formData);
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
          map(() => `${this.credentials.imagaBasePath}${res.id}`)
        )
      )
    );
  }
} 
