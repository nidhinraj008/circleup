import { Component, inject, Signal, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { enumToArray } from '../../core/functions/common-functions';
import { GenderEnum } from '../../core/enum/gender.enum';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { FireService } from '../../core/services/fire-service';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { addConnection, updateConnection, selectConnectionsByGender, selectConnectionsById, selectLargestId } from '../../core/features/connections';
import { Connection } from '../../core/types/connections';
import { StatusEnum } from '../../core/enum/status.enum';
import { GoogleDriveService } from '../../core/services/google-drive.service';
import { selectFileUploadFolderId } from '../../core/features/auth';
import { setFileUploadFolderId } from '../../core/features/auth/auth.actions';
import { Google_Drive_API_Url } from '../../app.config';
import { ActivatedRoute } from '@angular/router';
import { CRUDEnum } from '../../core/enum/crud.enum';
import { NgSelectModule } from '@ng-select/ng-select';
import { merge, take } from 'rxjs';
import { calculateFullAge } from '../../core/functions/common-functions';

declare var bootstrap: any;

@Component({
  selector: 'app-connection-add',
  imports: [ 
    FormsModule,
    ReactiveFormsModule, 
    DatePipe,
    NgSelectModule
  ],
  templateUrl: './connection-add.html',
  styleUrl: './connection-add.scss',
})
export class ConnectionAdd {

  googleDriveAPIUrl = inject(Google_Drive_API_Url);
  statusEnum = StatusEnum;
  fileToUpload: File | null = null;
  detailsForm!: FormGroup;
  maleConnections: Signal<any[]> = signal([]);
  femaleConnections: Signal<any[]> = signal([]);
  genderOptions = enumToArray(GenderEnum);
  statusOptions = enumToArray(StatusEnum);
  currentDate = new Date();
  currentMode!: CRUDEnum;
  imageLinkModalInstance: any;
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
    this.initDetailsForm();
    this.getRouterData();
    this.getConnectionsByGender();
    this.googleDriveService.initClient();
  }

  
  ngAfterViewInit() {
    this.imageLinkModalInstance = new bootstrap.Modal(document.getElementById('imageLinkModal'));
  }

  private getRouterData() {
    this.activatedRoute.data.subscribe(data => {
      this.currentMode = data['mode'];
      const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
      if (id > 0) {
        this.getEditData(id);
      }
    })
  }

  login() {
    this.googleDriveService.login();
  }

  // form section
  private initDetailsForm(value?: any) {
    this.detailsForm = this.fb.group({
      id: [value?.id ?? 0],
      name: [value?.name ?? '', Validators.required],
      gender: [value?.gender ?? undefined, Validators.required],
      dateOfBirth: [value?.dateOfBirth ?? ''],
      ageYears: [value?.ageYears ?? ''],
      ageMonths: [value?.ageMonths ?? ''],
      ageDays: [value?.ageDays ?? ''],
      father: [value?.father ?? null],
      mother: [value?.mother ?? null],
      notes: [value?.notes ?? ''],
      home: [value?.home ?? ''],
      status: [value?.status ?? StatusEnum.Alive, [Validators.required]],
      deathDate: [value?.deathDate ?? undefined],
      deathCause: [value?.deathCause ?? ''],
      primaryImageUrl: [value?.primaryImageUrl ?? null],
      isImageLink: [value?.isImageLink ?? false]
    });

    merge(
      this.detailsForm.get('dateOfBirth')!.valueChanges,
      this.detailsForm.get('status')!.valueChanges,
      this.detailsForm.get('deathDate')!.valueChanges
    ).subscribe(value => {
      let fullAge = calculateFullAge(this.detailsForm.value.status, this.detailsForm.value.dateOfBirth, this.detailsForm.value.deathDate)
      this.detailsForm.patchValue(fullAge, { emitEvent: false });
    });
  }

  get detailsFormControlls() { 
    return this.detailsForm.controls;
  }

  // image section
  public openOrShowLinkModal(visibility: boolean) {
    if (visibility) {
      this.imageLinkModalInstance.show();
    } else {
      this.imageLinkModalInstance.hide();
    }
  }

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

    this.detailsForm.get('primaryImageUrl')?.setValue(this.imageLink());
    this.fileToUpload = null;
    this.imageLink.set(null);
    this.isImageLinkValid.set(false);
    this.openOrShowLinkModal(false);
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
    this.detailsForm.get('primaryImageUrl')?.setValue(previewUrl);
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
        this.addOrUpdateConnection();
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
    
    this.addOrUpdateConnection();
  }

  private addOrUpdateConnection() {
    const params: Connection = {
      id: this.detailsForm.value.id,
      name: this.detailsForm.value.name,
      gender: Number(this.detailsForm.value.gender),
      dateOfBirth: this.detailsForm.value.dateOfBirth,
      father: this.detailsForm.value.father,
      mother: this.detailsForm.value.mother,
      notes: this.detailsForm.value.notes,
      primaryImageUrl: this.detailsForm.value.primaryImageUrl,
      home: this.detailsForm.value.home,
      status: this.detailsForm.value.status,
      deathDate: this.detailsForm.value.deathDate,
      deathCause: this.detailsForm.value.deathCause
    }

    if (this.currentMode == CRUDEnum.Create) {
      this.store.select(selectLargestId).pipe(take(1)).subscribe(id => {
        params.id = id + 1;
        this.store.dispatch(addConnection({ connection: params }));
      });
    } else {
      this.store.dispatch(updateConnection({ connection: params }));
    }

    this.initDetailsForm();
    this.fileToUpload = null;
  }

  private getEditData(id: number) {
    this.store.select(selectConnectionsById(id)).subscribe({
      next: (res: any) => {
        if (this.currentMode == CRUDEnum.Create) {
          res = { ...res, id: 0 }
        }
        this.initDetailsForm(res);
        let fullAge = calculateFullAge(res.status, res.dateOfBirth, res.deathDate)
        this.detailsForm.patchValue(fullAge, { emitEvent: false });
      }
    })
  }
}
