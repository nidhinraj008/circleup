import { Component, Signal, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { selectPersonsById } from '../../core/features/persons';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GenderEnum } from '../../shared/enum/gender.enum';
import { StatusEnum } from '../../shared/enum/status.enum';
import { DatePipe } from '@angular/common';
import { calculateFullAge } from '../../shared/functions/common-functions';

@Component({
  selector: 'app-person-view',
  imports: [
    DatePipe,
    RouterLink
  ],
  templateUrl: './person-view.html',
  styleUrl: './person-view.scss',
})
export class PersonView {
  
  personDetails = signal<any>(null);

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
    this.activatedRoute.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      id && this.getEditData(id);
    })
  }

  private getEditData(id: number) {
    this.store.select(selectPersonsById(id)).subscribe({
      next: (res: any) => {
        let fullAge = calculateFullAge(res?.status, res?.dateOfBirth, res?.deathDate);
        this.personDetails.set({ ...res, ...fullAge });
      }
    })
  }
}
