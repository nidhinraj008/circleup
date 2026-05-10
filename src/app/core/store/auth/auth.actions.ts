import { createAction, props } from '@ngrx/store';

export const setGoogleDriveAccessToken = createAction('[Auth] Set Google Drive Access Token', props<{ accessToken: string }>());
export const setFileUploadFolderId = createAction('[Auth] Set File Upload Folder Id', props<{ folderId: string }>());
