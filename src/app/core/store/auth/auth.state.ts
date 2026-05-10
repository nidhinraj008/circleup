export interface AuthState {
    googleDriveAccessToken: string;
    fileUploadFolderId: string;
}

export const initialAuthState: AuthState = {
    googleDriveAccessToken: "",
    fileUploadFolderId: ""
};
