import { Component, Signal, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { enumToArray } from '../../core/functions/common-functions';
import { GenderEnum } from '../../core/enum/gender.enum';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { FireService } from '../../core/services/fire-service';

import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { addConnection, selectConnectionsByGender } from '../../core/features/connections';
import { Connection } from '../../core/types/connections';
import { StatusEnum } from '../../core/enum/status.enum';

@Component({
  selector: 'app-connection-add',
  imports: [ 
    ReactiveFormsModule, 
    DatePipe,
  ],
  templateUrl: './connection-add.html',
  styleUrl: './connection-add.scss',
})
export class ConnectionAdd {

  imagePreview = signal<string>('');
  detailsForm!: FormGroup;
  maleConnections: Signal<any[]> = signal([]);
  femaleConnections: Signal<any[]> = signal([]);
  genderOptions = enumToArray(GenderEnum);
  currentDate = new Date();

  constructor(
    private fb: FormBuilder, 
    private fireService: FireService,
    private store: Store<AppState>
  ) {

  }

  ngOnInit(): void {
    this.initDetailsForm();
    this.getConnectionsByGender();
  }

  private initDetailsForm() {
    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      gender: [undefined, Validators.required],
      dateOfBirth: [''],
      ageYears: [''],
      ageMonths: [''],
      ageDays: [''],
      father: [],
      mother: [],
      notes: [''],
      image: [null],
      home: [''],
      status: [StatusEnum.Alive, [Validators.required]],
      deathDate: [undefined],
      deathCause: ['']
    });

    this.detailsForm.get('dateOfBirth')?.valueChanges.subscribe(value => {
      this.detailsForm.patchValue(this.calculateAge(value), { emitEvent: false });
    });
  }

  private calculateAge(value: any) {
    if (!value) {
      return { ageYears: '', ageMonths: '', ageDays: '' };
    }

    const birthDate = new Date(value);
    const start = moment(birthDate);
    const end = moment(this.currentDate);
    const years = end.diff(start, 'years');
    start.add(years, 'years');
    const months = end.diff(start, 'months');
    start.add(months, 'months');
    const days = end.diff(start, 'days');

    return {
      ageYears: years + ` year${years > 1 ? 's' : ''}`,
      ageMonths: months + ` month${months > 1 ? 's' : ''}`,
      ageDays: days + ` day${days > 1 ? 's' : ''}`
    };
  }

  get detailsFormControlls() { 
    return this.detailsForm.controls;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.detailsForm.patchValue({ image: file });
    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  private getConnectionsByGender() {
    this.maleConnections = this.store.selectSignal(selectConnectionsByGender(GenderEnum.Male));
    this.femaleConnections = this.store.selectSignal(selectConnectionsByGender(GenderEnum.Female));
  }

  public async onClickSubmit() {
    this.detailsForm.markAllAsTouched();
    if (this.detailsForm.invalid) return;

    let imageUrl = '';
    // if(this.imagePreview()) {
    //   imageUrl = await this.fireService.uploadImage(this.detailsForm.value.image);
    // }
    const connectionId = localStorage.getItem("connectionIdCounter") ? Number(localStorage.getItem("connectionIdCounter")) + 1 : 1;
    const params: Connection = {
      id: connectionId || 1,
      name: this.detailsForm.value.name,
      gender: Number(this.detailsForm.value.gender),
      dateOfBirth: this.detailsForm.value.dateOfBirth,
      father: this.detailsForm.value.father,
      mother: this.detailsForm.value.mother,
      notes: this.detailsForm.value.notes,
      primaryImage: imageUrl,
      home: '',
      status: 1,
      deathDate: undefined,
      deathCause: ''
    }
    // await this.fireService.addConnection(params);
    this.store.dispatch(addConnection({ connection: params }));
    localStorage.setItem("connectionIdCounter", connectionId.toString());

    this.initDetailsForm();
  }

}
