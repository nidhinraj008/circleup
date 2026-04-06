import { createSelector } from '@ngrx/store';
import { AppState } from '../../store/app.state';

export const selectConnectionsState = (state: AppState) => state.authentication;

/* google drive access token fetch */
export const selectGoogleDriveAccessToken = createSelector(selectConnectionsState, state => state.googleDriveAccessToken);

/* file upload folder id fetch */
export const selectFileUploadFolderId = createSelector(selectConnectionsState, state => state.fileUploadFolderId);