import { Component, Signal, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { selectConnectionsById } from '../../core/features/connections';
import { ActivatedRoute } from '@angular/router';
import { GenderEnum } from '../../core/enum/gender.enum';
import { StatusEnum } from '../../core/enum/status.enum';
import { DatePipe } from '@angular/common';
import { calculateFullAge } from '../../core/functions/common-functions';

@Component({
  selector: 'app-connection-view',
  imports: [
    DatePipe
  ],
  templateUrl: './connection-view.html',
  styleUrl: './connection-view.scss',
})
export class ConnectionView {
  
  connectionDetails = signal<any>(null);

  genderEnum = GenderEnum;
  statusEnum = StatusEnum;
  
  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.getRouterData();
  }

  private getRouterData() {
    this.activatedRoute.data.subscribe(data => {
      const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
      id && this.getEditData(id);
    })
  }

  private getEditData(id: number) {
    this.store.select(selectConnectionsById(id)).subscribe({
      next: (res: any) => {
        let fullAge = calculateFullAge(res?.status, res?.dateOfBirth, res?.deathDate);
        this.connectionDetails.set({ ...res, ...fullAge });
      }
    })
  }
}
