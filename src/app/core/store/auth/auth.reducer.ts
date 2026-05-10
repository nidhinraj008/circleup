import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authenticationReducer = createReducer(initialAuthState,
    on(AuthActions.setGoogleDriveAccessToken, (state, { accessToken }) => ({
        ...state,
        googleDriveAccessToken: accessToken
    })),
    on(AuthActions.setFileUploadFolderId, (state, { folderId }) => ({
        ...state,
        fileUploadFolderId: folderId
    }))
);