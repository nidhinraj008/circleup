import { Component, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { selectConnectionsById } from '../../core/features/connections/connections.selectors';
import { primaryConnection } from '../../shared/data/primary';
import { CommonData } from '../../shared/services/common-data';
import { GoogleDriveService } from '../../shared/services/google-drive.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  userDetails = signal<any>(null);;

  constructor(
    private store: Store<AppState>,
    private commonData: CommonData,
    private googleDriveService: GoogleDriveService,
  ) { }

  ngOnInit(): void {
    this.getConnections();
  }

  private getConnections() {
    this.store.select(selectConnectionsById(primaryConnection.id)).subscribe({
      next: (res: any) => {
        this.userDetails.set(res);
      },
      error: (err: any) => {
        this.commonData.error();
      }
    });
  }

  public googleLogin() {
    this.googleDriveService.login();
  }

}
