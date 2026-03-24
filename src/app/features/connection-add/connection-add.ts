import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { enumToArray } from '../../core/functions/common-functions';
import { GenderEnum } from '../../core/enum/gender.enum';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { FireService } from '../../core/services/fire-service';
@Component({
  selector: 'app-connection-add',
  imports: [ ReactiveFormsModule, DatePipe],
  templateUrl: './connection-add.html',
  styleUrl: './connection-add.scss',
})
export class ConnectionAdd {

  imagePreview = signal<string>('');
  detailsForm!: FormGroup;
  connectionsList: any[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Michael Johnson' }
  ];
  genderOptions = enumToArray(GenderEnum);

  currentDate = new Date();

  constructor(
    private fb: FormBuilder, 
    private fireService: FireService
  ) {}

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

  public async onClickSubmit() {
    this.detailsForm.markAllAsTouched();
    if (this.detailsForm.invalid) return;

    let imageUrl = '';
    if(this.imagePreview()) {
      imageUrl = await this.fireService.uploadImage(this.detailsForm.value.image);
    }

    const params = {
      name: this.detailsForm.value.name,
      gender: this.detailsForm.value.gender,
      dateOfBirth: this.detailsForm.value.dateOfBirth,
      father: this.detailsForm.value.father,
      mother: this.detailsForm.value.mother,
      notes: this.detailsForm.value.notes,
      primaryimage: imageUrl,
    }
    await this.fireService.addConnection(params);

    this.initDetailsForm();
  }

}
