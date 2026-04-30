# Requirements: Firebase Google Authentication

## 1. Objective
Implement a secure, production-ready Google Authentication system using Firebase for the CircleUp application. This phase focuses on enabling user identity and profile management via the Profile page.

## 2. Functional Requirements
*   **Google Auth (Popup)**: Users can sign in using their Google account via a popup window.
*   **Logout**: Users can securely sign out of the application.
*   **Session Persistence**: The authentication state must persist across page refreshes.
*   **User Information**: The application must retrieve and display the user's:
    *   Display Name
    *   Email Address
    *   Profile Picture (Avatar)

## 3. UI/UX Requirements
*   **Auth Controls**: Login and Logout buttons must be accessible from the Profile page.
*   **Dynamic State**: The Profile UI must automatically update when the authentication state changes.
*   **Initial State**: Unauthenticated users see a "Sign in with Google" option.
*   **Authenticated State**: Logged-in users see their profile details and a "Logout" option.

## 4. Technical Constraints
*   **Stack**: Angular 20 (Standalone), Firebase Modular SDK, Angular Signals.
*   **Backend**: No custom backend currently; validation is client-side via Firebase SDK.
*   **Config**: Firebase configuration is maintained in `src/app/app.config.ts`.

---
**Status**: Requirements Finalized
**Phase**: 1 (Google Auth Only)
