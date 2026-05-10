import { Component, DestroyRef, inject, Signal, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { enumToArray } from '../../../shared/functions/common-functions';
import { GenderEnum } from '../../../shared/enum/gender.enum';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/app.state';
import { addPerson, updatePerson, selectPersonsByGender, selectPersonsById, selectLargestPersonId } from '../store';
import { selectAllRelations, addRelation, selectLargestRelationId } from '../../relation/store';
import { Person } from '../../../shared/types/person';
import { StatusEnum } from '../../../shared/enum/status.enum';
import { RelationStatusEnum } from '../../../shared/enum/relation-status.enum';
import { GoogleDriveService } from '../../../shared/services/google-drive.service';
import { selectFileUploadFolderId, setFileUploadFolderId } from '../../../core/store/auth';
import { Google_Drive_API_Url } from '../../../app.config';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDEnum } from '../../../shared/enum/crud.enum';
import { NgSelectModule } from '@ng-select/ng-select';
import { combineLatest, merge, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { calculateFullAge } from '../../../shared/functions/common-functions';
import { assignPerson } from '../../../shared/functions/data-assign-functions';
import { CommonData } from '../../../shared/services/common-data';
import { Modal } from '../../../shared/components/modal/modal';
import moment from 'moment';
import { credentials } from '../../../shared/data/app-info';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-person-add',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgSelectModule,
    Modal
  ],
  templateUrl: './person-add.html',
  styleUrl: './person-add.scss',
})
export class PersonAdd {

  googleDriveAPIUrl = inject(Google_Drive_API_Url);
  private destroyRef = inject(DestroyRef);
  statusEnum = StatusEnum;
  fileToUpload: File | null = null;
  detailsForm!: FormGroup;
  malePersons: Signal<any[]> = signal([]);
  femalePersons: Signal<any[]> = signal([]);
  genderOptions = enumToArray(GenderEnum);
  statusOptions = enumToArray(StatusEnum);
  currentDate = new Date();
  currentMode!: CRUDEnum;
  imageLink = signal<string | null>(null);
  profileImageUrl = signal<string | null>(null);
  isImageLinkValid = signal<boolean>(false);
  showImageActionModal: boolean = false;
  showImageDeleteConfirmationModal: boolean = false;
  showImageLoadModal: boolean = false;
  readonly driveShareLink: string = "https://drive.google.com/file/d/";
  dobDisplay = '';
  dodDisplay = '';
  dobInvalid = signal<boolean>(false);
  dodInvalid = signal<boolean>(false);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private commonData: CommonData,
    private store: Store<AppState>,
    private googleDriveService: GoogleDriveService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.commonData.submitClick$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.onClickSubmit());
  }

  ngOnInit(): void {
    this.initDetailsForm();
    this.getRouterData();
    this.getPersonsByGender();
    this.googleDriveService.initClient();
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

  // form section
  private initDetailsForm(value?: any) {
    this.detailsForm = this.fb.group({
      id: [value?.id ?? 0],
      name: [value?.name ?? '', Validators.required],
      gender: [value?.gender ?? undefined, Validators.required],
      dateOfBirth: [value?.dateOfBirth ?? null],
      ageYears: [value?.ageYears ?? null],
      ageMonths: [value?.ageMonths ?? null],
      ageDays: [value?.ageDays ?? null],
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
    this.profileImageUrl.set(form.get('primaryImageUrl')?.value);
    form.get('primaryImageUrl')?.valueChanges.subscribe(v => this.profileImageUrl.set(v));

    this.dobDisplay = value?.dateOfBirth ? moment(value.dateOfBirth).format('DD-MM-YYYY') : 'dd-mm-yyyy';
    this.dodDisplay = value?.deathDate ? moment(value.deathDate).format('DD-MM-YYYY') : 'dd-mm-yyyy';
    this.dobInvalid.set(false);
    this.dodInvalid.set(false);

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
  public removeImage() {
    this.detailsForm.get('primaryImageUrl')?.setValue(null);
    this.fileToUpload = null;
    this.imageLink.set(null);
    this.isImageLinkValid.set(false);
    this.showImageDeleteConfirmationModal = false;
    this.showImageActionModal = false;
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
    url = url.trim();
    const imageId = url.match(new RegExp(`${this.driveShareLink}([^/]+)`))?.[1];
    if (imageId) {
      url = `${credentials.imageBasePath}${imageId}`
      this.imageLink.set(url)
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  public async onClickSaveLink() {
    if (!this.imageLink() || !await this.validateImageUrl(this.imageLink())) {
      this.commonData.warning("The provided image link is not valid.")
      return;
    }

    this.detailsForm.get('primaryImageUrl')?.setValue(this.imageLink());
    this.fileToUpload = null;
    this.imageLink.set(null);
    this.isImageLinkValid.set(false);
    this.showImageLoadModal = false;
    this.showImageActionModal = false;
  }

  private setFolderId(folderId: string) {
    this.store.dispatch(setFileUploadFolderId({ folderId }));
  }

  public isAuthenticated(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.commonData.warning("Please login with google to upload image.");
    }

    return this.authService.isAuthenticated();
  }

  public onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file)
      return;

    this.fileToUpload = file;
    const previewUrl = URL.createObjectURL(file);
    this.detailsForm.get('primaryImageUrl')?.setValue(previewUrl);
    this.showImageActionModal = false;
  }

  // #region Datepicker
  public onDateClick(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Find the first index of a placeholder character (d, m, or y)
    const firstPlaceholder = value.search(/[dmy]/);
    if (firstPlaceholder !== -1) {
      input.setSelectionRange(firstPlaceholder, firstPlaceholder);
    }
  }

  public onDateTextChange(event: Event, controlName: 'dateOfBirth' | 'deathDate') {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    const selectionStart = input.selectionStart ?? 0;

    // Split by hyphens to maintain slots
    let parts = value.split('-');
    while (parts.length < 3) parts.push('');

    // Extract digits for each part and limit lengths
    const d = parts[0].replace(/\D/g, '').slice(0, 2);
    const m = parts[1].replace(/\D/g, '').slice(0, 2);
    const y = parts[2].replace(/\D/g, '').slice(0, 4);
    const fullDigits = d + m + y;

    // Reconstruct with placeholders
    const formatted =
      (d + 'dd').slice(0, 2) + '-' +
      (m + 'mm').slice(0, 2) + '-' +
      (y + 'yyyy').slice(0, 4);

    if (controlName === 'dateOfBirth') this.dobDisplay = formatted;
    else this.dodDisplay = formatted;

    input.value = formatted;

    // Restore cursor position
    // We calculate how many digits/delimiters are before the original cursor
    // and try to map it back. 
    // A simple digitsBefore + hyphen adjustment works for most cases.
    const rawBefore = value.substring(0, selectionStart);
    const digitsBefore = rawBefore.replace(/\D/g, '').length;
    const hyphensBefore = (rawBefore.match(/-/g) || []).length;

    let newPos = 0;
    let digitsSeen = 0;
    let hyphensSeen = 0;

    for (let i = 0; i < formatted.length; i++) {
      if (formatted[i] === '-') {
        if (hyphensSeen < hyphensBefore || (digitsSeen === digitsBefore && hyphensSeen < 2)) {
          newPos = i + 1;
          hyphensSeen++;
        }
      } else if (!isNaN(parseInt(formatted[i]))) {
        if (digitsSeen < digitsBefore) {
          newPos = i + 1;
          digitsSeen++;
        }
      } else {
        // Placeholder char
        if (digitsSeen < digitsBefore) {
          // This shouldn't really happen if we only have digits in digitsBefore
        } else if (newPos === 0) {
          newPos = i;
        }
        break;
      }
    }

    // Fallback for empty or initial typing
    if (newPos === 0 && digitsBefore > 0) newPos = formatted.indexOf(fullDigits[0]) + 1;
    if (newPos === 0) newPos = selectionStart;

    // Boundary checks
    newPos = Math.min(newPos, 10);
    input.setSelectionRange(newPos, newPos);

    // Sync form value
    if (fullDigits.length === 8) {
      const momentObj = moment(formatted, 'DD-MM-YYYY', true);
      if (momentObj.isValid()) {
        const isoDate = momentObj.format('YYYY-MM-DD');
        if (controlName === 'dateOfBirth' && momentObj.isAfter(moment())) {
          this.setDateInvalid(controlName, true);
          this.detailsForm.get(controlName)?.setValue(null, { emitEvent: true });
        } else {
          this.setDateInvalid(controlName, false);
          this.detailsForm.get(controlName)?.setValue(isoDate, { emitEvent: true });
        }
      } else {
        this.setDateInvalid(controlName, true);
        this.detailsForm.get(controlName)?.setValue(null, { emitEvent: true });
      }
    } else {
      this.setDateInvalid(controlName, false);
      this.detailsForm.get(controlName)?.setValue(null, { emitEvent: true });
    }
  }

  public onNativeDateChange(event: Event, controlName: 'dateOfBirth' | 'deathDate') {
    const value = (event.target as HTMLInputElement).value;
    if (!value)
      return;

    const m = moment(value, 'YYYY-MM-DD');
    const display = m.format('DD-MM-YYYY');

    if (controlName === 'dateOfBirth')
      this.dobDisplay = display;
    else if (controlName == 'deathDate')
      this.dodDisplay = display;

    this.setDateInvalid(controlName, false);
    this.detailsForm.get(controlName)?.setValue(value, { emitEvent: true });
  }

  private setDateInvalid(controlName: 'dateOfBirth' | 'deathDate', invalid: boolean) {
    if (controlName === 'dateOfBirth')
      this.dobInvalid.set(invalid);
    else if (controlName == 'deathDate')
      this.dodInvalid.set(invalid);
  }
  // #endregion


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
      error: (err: any) => {
        this.commonData.hideLoader();
        this.commonData.error("Image upload failed")
      }
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
      error: (err: any) => {
        this.commonData.hideLoader();
        this.commonData.error("Image upload failed")
      }
    })
  }

  private uploadFile(file: File, folderId: string) {
    this.googleDriveService.uploadAsPublicFile(file, folderId).subscribe({
      next: (res: any) => {
        this.commonData.hideLoader();
        this.detailsForm.patchValue({ primaryImageUrl: res });
        this.addOrUpdatePerson();
      },
      error: (err: any) => {
        this.commonData.hideLoader();
        this.commonData.error("Image upload failed")
      }
    });
  }

  private getPersonsByGender() {
    this.malePersons = this.store.selectSignal(selectPersonsByGender(GenderEnum.Male));
    this.femalePersons = this.store.selectSignal(selectPersonsByGender(GenderEnum.Female));
  }

  public async onClickSubmit() {
    if (this.commonData.isLoading())
      return;

    this.detailsForm.markAllAsTouched();
    if (this.detailsForm.invalid) {
      this.commonData.warning("Invalid data");
      return;
    }

    this.commonData.showLoader();
    if (this.fileToUpload) {
      this.initImageUpload();
      return;
    }

    this.addOrUpdatePerson();
  }

  private addOrUpdatePerson() {
    let person: Person = assignPerson(this.detailsForm.value);
    if (this.currentMode == CRUDEnum.Create) {
      this.store.select(selectLargestPersonId).pipe(take(1)).subscribe(id => {
        person.id = id + 1;
        this.store.dispatch(addPerson({ person: person }));
      });
      this.initDetailsForm();
      this.fileToUpload = null;
      this.commonData.hideLoader();
      this.commonData.success("Item added successfully");
    } else {
      this.store.dispatch(updatePerson({ person: person }));
      this.commonData.success("Item updated successfully");
      this.commonData.hideLoader();
      this.router.navigate(['persons'])
    }

    // Auto create relation relationship if parents are selected
    this.autoCreateRelation(person.fatherId, person.motherId);
  }

  private autoCreateRelation(fatherId: number | null, motherId: number | null) {
    if (fatherId && motherId) {
      combineLatest([
        this.store.select(selectAllRelations),
        this.store.select(selectLargestRelationId)
      ]).pipe(take(1)).subscribe(([relations, largestId]) => {
        const exists = relations.some(r => (Number(r.maleId) === fatherId && Number(r.femaleId) === motherId));
        if (exists) {
          return;
        }
        const relation = {
          id: largestId + 1,
          maleId: fatherId.toString(),
          femaleId: motherId.toString(),
          status: RelationStatusEnum.Married,
          firstSeenDate: null,
          marriageDate: null,
          separationDate: null
        }
        this.store.dispatch(addRelation({ relation: relation }));
      });
    }
  }

  private getEditData(id: number) {
    this.store.select(selectPersonsById(id)).subscribe({
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
