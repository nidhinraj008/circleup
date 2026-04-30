import { Component, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonData } from '../../shared/services/common-data';
import { AuthService } from '../../core/services/auth.service';
import { Modal } from '../../shared/components/modal/modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink,
    Modal,
    CommonModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  showLogoutConfirmation: boolean = false;
  showLoginModal: boolean = false;

  constructor(
    private commonData: CommonData,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {

  }

  public async googleLogin() {
    if (this.authService.isAuthenticated()) {
      this.commonData.info('Already logged in');
      return;
    }

    try {
      await this.authService.loginWithGoogle();
      this.showLoginModal = false;
    } catch (error: any) {
      this.commonData.error(error.message || 'Login failed');
    }
  }

  public async logout() {
    try {
      await this.authService.logout();
      this.showLoginModal = this.showLogoutConfirmation = false;
    } catch (error: any) {
      this.commonData.error(error.message || 'Logout failed');
    }
  }
}
