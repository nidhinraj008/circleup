import { createSelector } from '@ngrx/store';
import { AppState } from '../../store/app.state';

export const selectAuthenticationState = (state: AppState) => state.authentication;

/* google drive access token fetch */
export const selectGoogleDriveAccessToken = createSelector(selectAuthenticationState, state => state.googleDriveAccessToken);

/* file upload folder id fetch */
export const selectFileUploadFolderId = createSelector(selectAuthenticationState, state => state.fileUploadFolderId);