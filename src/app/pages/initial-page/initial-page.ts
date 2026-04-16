import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenderEnum } from '../../shared/enum/gender.enum';
import { enumToArray } from '../../shared/functions/common-functions';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePipe } from '@angular/common';
import { combineLatest, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { selectConnectionsById, addConnection, updateConnection } from '../../core/features/connections';
import { selectFamilyById, addFamily } from '../../core/features/family';
import { myFamily, primaryConnection } from '../../shared/data/primary';
import { Family } from '../../shared/types/family';
import { Connection } from '../../shared/types/connections';
import { assignConnection } from '../../shared/functions/data-assign-functions';
import { Router } from '@angular/router';
import { StatusEnum } from '../../shared/enum/status.enum';

@Component({
  selector: 'app-initial-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    DatePipe,
  ],
  templateUrl: './initial-page.html',
  styleUrl: './initial-page.scss',
})
export class InitialPage {

  initialForm!: FormGroup;
  currentDate = new Date();

  genderOptions: any[] = [];
  userDetails: any;
  familyDetails!: Family | null;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initInitialForm(); 
    this.getAllValues(); 
    this.checkDataExist(); 
  }

  private initInitialForm() {
    this.initialForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      dateOfBirth: [null],
    })
  }

  get initialFormControlls() {
    return this.initialForm.controls
  }

  private getAllValues() {
    this.genderOptions = enumToArray(GenderEnum);
  }

  // API calls
  private checkDataExist() {
    combineLatest([
      this.store.select(selectConnectionsById(primaryConnection.id)),
      this.store.select(selectFamilyById(myFamily.id))
    ]).pipe(
      tap(([user, family]) => {
        this.userDetails = user;
        this.familyDetails = family;
        if (user) {
          this.initialForm.patchValue({
            name: user.name,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
          });
        }
      }),
      take(1)
    ).subscribe();
  }

  public onClickSubmit() {
    this.initialForm.markAllAsTouched();
    if (this.initialForm.invalid) {
      return;
    }
    if(!this.familyDetails) {
      this.store.dispatch(addFamily({ family: myFamily }));
    }
    let params = {
      ...this.userDetails,
      name: this.initialForm.value.name,
      gender: this.initialForm.value.gender,
      dateOfBirth: this.initialForm.value.dateOfBirth,
      familyId: myFamily.id,
      status: StatusEnum.Alive,
    }
    let connection: Connection = assignConnection(params);
    if(this.userDetails) {
      this.store.dispatch(updateConnection({ connection: connection }))
    } else {
      connection.id = primaryConnection.id;
      this.store.dispatch(addConnection({ connection: connection }))
    }

    this.router.navigate(['/'])
  }
}
