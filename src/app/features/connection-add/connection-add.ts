import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { enumToArray } from '../../core/functions/common-functions';
import { GenderEnum } from '../../core/enum/gender.enum';
import { DatePipe } from '@angular/common';
import moment from 'moment';
@Component({
  selector: 'app-connection-add',
  imports: [ ReactiveFormsModule, DatePipe],
  templateUrl: './connection-add.html',
  styleUrl: './connection-add.scss',
})
export class ConnectionAdd {

  imagePreview: any;
  detailsForm!: FormGroup;
  connectionsList: any[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Michael Johnson' }
  ];
  genderOptions = enumToArray(GenderEnum);


  currentDate = new Date();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initDetailsForm();
    
  }

  private initDetailsForm() {
    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: [''],
      ageYears: [''],
      ageMonths: [''],
      ageDays: [''],
      father: [],
      mother: [],
      notes: [''],
      image: [null]
    });

    this.detailsForm.get('dateOfBirth')?.valueChanges.subscribe(value => {
      if (!value) {
        this.detailsForm.patchValue({ ageYears: '', ageMonths: '', ageDays: '' }, { emitEvent: false });
        return;
      }

      const birthDate = new Date(value);
      const start = moment(birthDate);
      const end = moment(this.currentDate);

      const years = end.diff(start, 'years');
      start.add(years, 'years');

      const months = end.diff(start, 'months');
      start.add(months, 'months');

      const days = end.diff(start, 'days');

      this.detailsForm.patchValue({
        ageYears: years + ` year${years > 1 ? 's' : ''}`,
        ageMonths: months + ` month${months > 1 ? 's' : ''}`,
        ageDays: days + ` day${days > 1 ? 's' : ''}`
      }, { emitEvent: false });
    });
  }

  get detailsFormControlls() { return this.detailsForm.controls; }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.detailsForm.patchValue({ image: file });
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(file);
  }

  public onClickSubmit() {
    this.detailsForm.markAllAsTouched();
    if (this.detailsForm.invalid) return;


    console.log(this.detailsForm.value);
  }

}
