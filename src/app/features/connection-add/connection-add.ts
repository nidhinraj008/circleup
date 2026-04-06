import { Component, inject, Signal, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { GoogleDriveService } from '../../core/services/google-drive.service';
import { selectFileUploadFolderId } from '../../core/features/auth';
import { setFileUploadFolderId } from '../../core/features/auth/auth.actions';
import { Google_Drive_API_Url } from '../../app.config';
import { ActivatedRoute } from '@angular/router';
import { CRUDEnum } from '../../core/enum/crud.enum';
declare var bootstrap: any;

@Component({
  selector: 'app-connection-add',
  imports: [ 
    FormsModule,
    ReactiveFormsModule, 
    DatePipe,
  ],
  templateUrl: './connection-add.html',
  styleUrl: './connection-add.scss',
})
export class ConnectionAdd {

  googleDriveAPIUrl = inject(Google_Drive_API_Url);
  fileToUpload: File | null = null;
  detailsForm!: FormGroup;
  maleConnections: Signal<any[]> = signal([]);
  femaleConnections: Signal<any[]> = signal([]);
  genderOptions = enumToArray(GenderEnum);
  currentDate = new Date();
  currentMode!: CRUDEnum;
  
  imagePreview = signal<string | null>(null);
  imageLink = signal<string | null>(null);
  isImageLinkValid = signal<boolean>(false);

  constructor(
    private fb: FormBuilder, 
    private fireService: FireService,
    private store: Store<AppState>,
    private googleDriveService: GoogleDriveService,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.getRouterData();
    this.initDetailsForm();
    this.getConnectionsByGender();
    this.googleDriveService.initClient();
  }

  private getRouterData() {
    this.activatedRoute.data.subscribe(data => {
      this.currentMode = data['mode'];
    })
  }

  login() {
    this.googleDriveService.login();
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
      home: [''],
      status: [StatusEnum.Alive, [Validators.required]],
      deathDate: [undefined],
      deathCause: [''],
      primaryImageUrl: [''],
      isImageLink: [false]
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

  // image
  async onClickLoadImage() {
    if (!this.imageLink()) 
      return;

    const valid = await this.validateImageUrl(this.imageLink());

    if (valid) {
      this.isImageLinkValid.set(true);
    } else {
      this.isImageLinkValid.set(false);
    }
  }

  private validateImageUrl(url: any): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  public onClickSaveLink() {
    if (!this.isImageLinkValid()) {
      return;
    }

    this.imagePreview.set(this.imageLink());
    this.detailsForm.get('primaryImageUrl')?.setValue(this.imageLink());
    
    this.fileToUpload = null;
    this.imageLink.set(null);
    this.isImageLinkValid.set(false);

    const modalElement = document.getElementById('staticBackdrop');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    
  }

  private setFolderId(folderId: string) {
    this.store.dispatch(setFileUploadFolderId({ folderId }));
  }

  public onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) 
      return;

    this.fileToUpload = file;
    const previewUrl = URL.createObjectURL(file);
    this.imagePreview.set(previewUrl);
  }

  /* API calls */
  private initImageUpload() {
    let folderId = this.store.selectSignal(selectFileUploadFolderId)();
    if (folderId && this.fileToUpload) {
      this.uploadFile(this.fileToUpload, folderId);
      return;
    }

    this.googleDriveService.searchFolder().subscribe({
      next: (res :any) => {
        folderId = res.files?.[0]?.id;
        if (folderId && this.fileToUpload) {
          this.uploadFile(this.fileToUpload, folderId);
          this.setFolderId(folderId);
        } else {
          this.createFolderAndUploadFile();
        }
      },
      error: (err :any) => console.error(err)
    });
  }

  private createFolderAndUploadFile() {
    this.googleDriveService.createFolder().subscribe({
      next: (res :any) => {
        if(res?.id && this.fileToUpload) {
          this.setFolderId(res.id);
          this.uploadFile(this.fileToUpload, res.id);
        }
      },
      error: (err :any) => console.error(err)
    })
  }

  private uploadFile(file: File, folderId: string) {
    this.googleDriveService.uploadAsPublicFile(file, folderId).subscribe({
      next: (res: any) => {
        this.detailsForm.patchValue({ primaryImageUrl: res });
        this.addConnection();
      },
      error: (err: any) => console.error(err)
    });
  }

  private getConnectionsByGender() {
    this.maleConnections = this.store.selectSignal(selectConnectionsByGender(GenderEnum.Male));
    this.femaleConnections = this.store.selectSignal(selectConnectionsByGender(GenderEnum.Female));
  }

  public async onClickSubmit() {
    this.detailsForm.markAllAsTouched();
    if (this.detailsForm.invalid) 
      return;

    if (this.fileToUpload) {
      this.initImageUpload();
      return;
    } 
    
    this.addConnection();
  }

  private addConnection() {
    const connectionId = localStorage.getItem("connectionIdCounter") ? Number(localStorage.getItem("connectionIdCounter")) + 1 : 1;
    const params: Connection = {
      id: connectionId || 1,
      name: this.detailsForm.value.name,
      gender: Number(this.detailsForm.value.gender),
      dateOfBirth: this.detailsForm.value.dateOfBirth,
      father: this.detailsForm.value.father,
      mother: this.detailsForm.value.mother,
      notes: this.detailsForm.value.notes,
      primaryImageUrl: this.detailsForm.value.primaryImageUrl,
      home: '',
      status: 1,
      deathDate: undefined,
      deathCause: ''
    }

    this.store.dispatch(addConnection({ connection: params }));
    localStorage.setItem("connectionIdCounter", connectionId.toString());

    this.initDetailsForm();
    this.fileToUpload = null;
    this.imagePreview.set(null);
  }

}
