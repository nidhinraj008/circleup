# Implementation Plan: Firebase Google Authentication

## 1. Overview
This plan outlines the steps for implementing Google Authentication in the CircleUp application using Firebase, based on the `Requirements_Auth.md` specification.

## 2. Phase 1: Infrastructure & Configuration
*   [x] **Firebase Setup**: Verify Firebase dependencies are present in `package.json`.
*   [x] **App Configuration**: Initialize Firebase in `src/app/app.config.ts`.
*   [x] **Provider Configuration**: Register `provideAuth()` to enable authentication services globally.

## 3. Phase 2: Core Service Layer
*   [x] **AuthService Creation**: Implement `src/app/core/services/auth.service.ts`.
*   [x] **State Management**: Use Angular Signals (`currentUser`, `isAuthenticated`) to manage auth state reactively.
*   [x] **Auth Methods**: 
    *   [x] Implement `loginWithGoogle()` using `signInWithPopup`.
    *   [x] Implement `logout()` using `signOut`.
*   [x] **Token Management**: Provide `getIdToken()` for future backend integration.

## 4. Phase 3: UI/UX Integration
*   [x] **Profile Logic**: Inject `AuthService` into `src/app/pages/profile/profile.ts`.
*   [x] **Conditional Templates**: 
    *   [x] Show "Sign in with Google" button for guests.
    *   [x] Show User Name, Email, and Photo for authenticated users.
    *   [x] Add "Logout" functionality to the profile list.
*   [x] **Reactive Updates**: Ensure the UI responds immediately to auth state changes via Signals.

## 5. Phase 4: Validation & Polish
*   [ ] **Manual Verification**: Test the login popup across different browsers.
*   [ ] **Session Persistence Check**: Verify the user remains logged in after a page refresh.
*   [ ] **Error Handling**: Ensure graceful failure if the popup is blocked or the user cancels.

## 6. Future Considerations (Out of Scope for Phase 1)
*   [ ] Implement `AuthGuard` for route protection.
*   [ ] Implement `AuthInterceptor` for backend API calls.
*   [ ] Add Email/Password registration flow.

---
**Status**: Implementation Substantially Complete
**Updated**: 2026-04-30
