import { Component, inject, Signal, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { enumToArray } from '../../shared/functions/common-functions';
import { GenderEnum } from '../../shared/enum/gender.enum';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { addConnection, updateConnection, selectConnectionsByGender, selectConnectionsById, selectLargestId } from '../../core/features/connections';
import { Connection } from '../../shared/types/connections';
import { StatusEnum } from '../../shared/enum/status.enum';
import { GoogleDriveService } from '../../shared/services/google-drive.service';
import { selectFileUploadFolderId } from '../../core/features/auth';
import { setFileUploadFolderId } from '../../core/features/auth/auth.actions';
import { Google_Drive_API_Url } from '../../app.config';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDEnum } from '../../shared/enum/crud.enum';
import { NgSelectModule } from '@ng-select/ng-select';
import { merge, take } from 'rxjs';
import { calculateFullAge } from '../../shared/functions/common-functions';
import { selectAllFamilies } from '../../core/features/family';
import { assignConnection } from '../../shared/functions/data-assign-functions';
import { CommonData } from '../../shared/services/common-data';

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
  familiesList: Signal<any[]> = signal([]);
  genderOptions = enumToArray(GenderEnum);
  statusOptions = enumToArray(StatusEnum);
  currentDate = new Date();
  currentMode!: CRUDEnum;
  imageLinkModalInstance: any;
  imageLink = signal<string | null>(null);
  isImageLinkValid = signal<boolean>(false);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private commonData: CommonData,
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
      dateOfBirth: [value?.dateOfBirth ?? null],
      ageYears: [value?.ageYears ?? ''],
      ageMonths: [value?.ageMonths ?? ''],
      ageDays: [value?.ageDays ?? ''],
      familyId: [value?.familyId ?? null],
      fatherId: [value?.fatherId ?? null],
      motherId: [value?.motherId ?? null],
      notes: [value?.notes ?? ''],
      home: [value?.home ?? ''],
      status: [value?.status ?? StatusEnum.Alive, [Validators.required]],
      deathDate: [value?.deathDate ?? undefined],
      deathCause: [value?.deathCause ?? ''],
      primaryImageUrl: [value?.primaryImageUrl ?? null],
      isImageLink: [value?.isImageLink ?? false]
    });

    const form = this.detailsForm;
    const dateOfBirth$ = form.get('dateOfBirth')!.valueChanges;
    const status$ = form.get('status')!.valueChanges;
    const deathDate$ = form.get('deathDate')!.valueChanges;

    merge(dateOfBirth$, status$, deathDate$).subscribe(() => {
      const { status, dateOfBirth, deathDate } = form.getRawValue();
      form.patchValue(calculateFullAge(status, dateOfBirth, deathDate), { emitEvent: false });
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
    if (!this.imageLink()) {
      this.commonData.warning("Please provide an image link.")
      return;
    }

    const valid = await this.validateImageUrl(this.imageLink());

    if (valid) {
      this.isImageLinkValid.set(true);
    } else {
      this.isImageLinkValid.set(false);
      this.commonData.warning("The provided image link is not valid.")
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

  public async onClickSaveLink() {
    if (!this.imageLink() && !await this.validateImageUrl(this.imageLink())) {
      this.commonData.warning("The provided image link is not valid.")
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
      next: (res: any) => {
        folderId = res.files?.[0]?.id;
        if (folderId && this.fileToUpload) {
          this.uploadFile(this.fileToUpload, folderId);
          this.setFolderId(folderId);
        } else {
          this.createFolderAndUploadFile();
        }
      },
      error: (err: any) =>
        this.commonData.error("Image upload failed")
    });
  }

  private createFolderAndUploadFile() {
    this.googleDriveService.createFolder().subscribe({
      next: (res: any) => {
        if (res?.id && this.fileToUpload) {
          this.setFolderId(res.id);
          this.uploadFile(this.fileToUpload, res.id);
        }
      },
      error: (err: any) =>
        this.commonData.error("Image upload failed")
    })
  }

  private uploadFile(file: File, folderId: string) {
    this.googleDriveService.uploadAsPublicFile(file, folderId).subscribe({
      next: (res: any) => {
        this.detailsForm.patchValue({ primaryImageUrl: res });
        this.addOrUpdateConnection();
      },
      error: (err: any) =>
        this.commonData.error("Image upload failed")
    });
  }

  private getConnectionsByGender() {
    this.familiesList = this.store.selectSignal(selectAllFamilies);
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
    let connection: Connection = assignConnection(this.detailsForm.value);
    if (this.currentMode == CRUDEnum.Create) {
      this.store.select(selectLargestId).pipe(take(1)).subscribe(id => {
        connection.id = id + 1;
        this.store.dispatch(addConnection({ connection: connection }));
      });
      this.initDetailsForm();
      this.fileToUpload = null;
      this.commonData.success("Item added successfully");
    } else {
      this.store.dispatch(updateConnection({ connection: connection }));
      this.commonData.success("Item updated successfully");
      this.router.navigate(['connections'])
    }
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
      },
      error: () => {
        this.commonData.error();
      }
    })
  }
}
