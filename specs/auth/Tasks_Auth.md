# Task List: Google Authentication Integration

This file contains granular tasks for the Firebase Google Auth implementation.

## 🟢 Configuration & Setup
- [x] **Task 1**: Update `app.config.ts` with `provideAuth` and `getAuth`.
- [x] **Task 2**: Ensure `firebaseConfig` object contains correct API keys.
- [x] **Task 3**: Remove redundant `environment.ts` files to keep config centralized.

## 🔵 Core Logic (`AuthService`)
- [x] **Task 4**: Initialize `Auth` instance via `inject(Auth)`.
- [x] **Task 5**: Create `currentUser` Signal using `toSignal` from `@angular/core/rxjs-interop`.
- [x] **Task 6**: Implement `loginWithGoogle()` method using `signInWithPopup`.
- [x] **Task 7**: Implement `logout()` method using `signOut`.
- [x] **Task 8**: Add `getIdToken()` helper for future backend use.

## 🟠 UI Integration (`ProfileComponent`)
- [x] **Task 9**: Inject `AuthService` into `Profile` component class.
- [x] **Task 10**: Implement `googleLogin()` and `logout()` wrapper methods with error handling.
- [x] **Task 11**: Update `profile.html` to show user photo and name if `currentUser` signal is set.
- [x] **Task 12**: Use `@if` block to toggle "Sign in with Google" vs "Logout" list items.
- [x] **Task 13**: Style the profile image with `rounded-circle` and `border`.

## 🟡 Verification & Testing
- [ ] **Task 14**: Verify that clicking "Sign in with Google" opens the Firebase popup correctly.
- [ ] **Task 15**: Confirm profile details (Name/Email/Photo) update immediately after login.
- [ ] **Task 16**: Test "Logout" clears the session and returns the UI to "Guest" state.
- [ ] **Task 17**: Refresh the page while logged in to verify session persistence.

---
**Last Updated**: 2026-04-30
