import { Component, inject, DestroyRef, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDEnum } from '../../../shared/enum/crud.enum';
import { addRelation, selectRelationById, selectLargestRelationId, updateRelation } from '../store';
import { selectPersonsByGender } from '../../person/store';
import { take } from 'rxjs';
import { CommonData } from '../../../shared/services/common-data';
import { NgSelectModule } from '@ng-select/ng-select';
import { GenderEnum } from '../../../shared/enum/gender.enum';
import { RelationStatusEnum } from '../../../shared/enum/relation-status.enum';
import { enumToArray } from '../../../shared/functions/common-functions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-relation-add',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    DatePipe
  ],
  templateUrl: './relation-add.html',
  styleUrl: './relation-add.scss',
})
export class RelationAdd {

  relationForm!: FormGroup;
  currentMode!: CRUDEnum;
  malePersons = signal<any[]>([]);
  femalePersons = signal<any[]>([]);
  statusOptions = enumToArray(RelationStatusEnum);
  relationStatusEnum = RelationStatusEnum;
  private destroyRef = inject(DestroyRef);
  currentDate = new Date();

  marriageDateDisplay = '';
  separationDateDisplay = '';
  firstSeenDateDisplay = '';

  marriageDateInvalid = signal<boolean>(false);
  separationDateInvalid = signal<boolean>(false);
  firstSeenDateInvalid = signal<boolean>(false);

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private commonData: CommonData
  ) {
    this.commonData.submitClick$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.onClickSubmit());
  }

  ngOnInit(): void {
    this.initRelationForm();
    this.loadPersons();
    this.getRouterData();
  }

  private initRelationForm(data?: any) {
    this.relationForm = this.formBuilder.group({
      id: [data?.id ?? null],
      maleId: [data?.maleId ?? null, Validators.required],
      femaleId: [data?.femaleId ?? null, Validators.required],
      status: [data?.status ?? 1],
      marriageDate: [data?.marriageDate ?? null],
      separationDate: [data?.separationDate ?? null],
      firstSeenDate: [data?.firstSeenDate ?? null]
    });

    this.marriageDateDisplay = data?.marriageDate ? moment(data.marriageDate).format('DD-MM-YYYY') : 'dd-mm-yyyy';
    this.separationDateDisplay = data?.separationDate ? moment(data.separationDate).format('DD-MM-YYYY') : 'dd-mm-yyyy';
    this.firstSeenDateDisplay = data?.firstSeenDate ? moment(data.firstSeenDate).format('DD-MM-YYYY') : 'dd-mm-yyyy';
    
    this.marriageDateInvalid.set(false);
    this.separationDateInvalid.set(false);
    this.firstSeenDateInvalid.set(false);
  }

  private loadPersons() {
    this.store.select(selectPersonsByGender(GenderEnum.Male)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.malePersons.set(res);
    });
    this.store.select(selectPersonsByGender(GenderEnum.Female)).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.femalePersons.set(res);
    });
  }

  private getRouterData() {
    this.activatedRoute.data.subscribe(data => {
      this.currentMode = data['mode'];
      const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
      if (id > 0) {
        this.getRelationData(id);
      }
    });
  }

  private getRelationData(id: number) {
    this.store.select(selectRelationById(id)).pipe(take(1)).subscribe({
      next: (res: any) => {
        if (res) {
          this.initRelationForm(res);
        }
      }
    });
  }

  public onClickSubmit() {
    this.relationForm.markAllAsTouched();
    if (this.relationForm.invalid) {
      this.commonData.warning("Invalid data");
      return;
    }

    const relation = { ...this.relationForm.value };

    if (this.currentMode == CRUDEnum.Create) {
      this.store.select(selectLargestRelationId).pipe(take(1)).subscribe(id => {
        relation.id = id + 1;
        this.store.dispatch(addRelation({ relation }));
        this.commonData.success("Relation added successfully");
        this.router.navigate(['relations']);
      });
    } else {
      this.store.dispatch(updateRelation({ relation }));
      this.commonData.success("Relation updated successfully");
      this.router.navigate(['relations']);
    }
  }

  // #region Datepicker
  public onDateClick(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    const firstPlaceholder = value.search(/[dmy]/);
    if (firstPlaceholder !== -1) {
      input.setSelectionRange(firstPlaceholder, firstPlaceholder);
    }
  }

  public onDateTextChange(event: Event, controlName: 'marriageDate' | 'separationDate' | 'firstSeenDate') {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    const selectionStart = input.selectionStart ?? 0;

    let parts = value.split('-');
    while (parts.length < 3) parts.push('');

    const d = parts[0].replace(/\D/g, '').slice(0, 2);
    const m = parts[1].replace(/\D/g, '').slice(0, 2);
    const y = parts[2].replace(/\D/g, '').slice(0, 4);
    const fullDigits = d + m + y;

    const formatted =
      (d + 'dd').slice(0, 2) + '-' +
      (m + 'mm').slice(0, 2) + '-' +
      (y + 'yyyy').slice(0, 4);

    if (controlName === 'marriageDate') this.marriageDateDisplay = formatted;
    else if (controlName === 'separationDate') this.separationDateDisplay = formatted;
    else if (controlName === 'firstSeenDate') this.firstSeenDateDisplay = formatted;

    input.value = formatted;

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
        if (digitsSeen < digitsBefore) {
        } else if (newPos === 0) {
          newPos = i;
        }
        break;
      }
    }

    if (newPos === 0 && digitsBefore > 0) newPos = formatted.indexOf(fullDigits[0]) + 1;
    if (newPos === 0) newPos = selectionStart;

    newPos = Math.min(newPos, 10);
    input.setSelectionRange(newPos, newPos);

    if (fullDigits.length === 8) {
      const momentObj = moment(formatted, 'DD-MM-YYYY', true);
      if (momentObj.isValid()) {
        const isoDate = momentObj.format('YYYY-MM-DD');
        if (momentObj.isAfter(moment())) {
          this.setDateInvalid(controlName, true);
          this.relationForm.get(controlName)?.setValue(null, { emitEvent: true });
        } else {
          this.setDateInvalid(controlName, false);
          this.relationForm.get(controlName)?.setValue(isoDate, { emitEvent: true });
        }
      } else {
        this.setDateInvalid(controlName, true);
        this.relationForm.get(controlName)?.setValue(null, { emitEvent: true });
      }
    } else {
      this.setDateInvalid(controlName, false);
      this.relationForm.get(controlName)?.setValue(null, { emitEvent: true });
    }
  }

  public onNativeDateChange(event: Event, controlName: 'marriageDate' | 'separationDate' | 'firstSeenDate') {
    const value = (event.target as HTMLInputElement).value;
    if (!value)
      return;

    const m = moment(value, 'YYYY-MM-DD');
    const display = m.format('DD-MM-YYYY');

    if (controlName === 'marriageDate')
      this.marriageDateDisplay = display;
    else if (controlName == 'separationDate')
      this.separationDateDisplay = display;
    else if (controlName == 'firstSeenDate')
      this.firstSeenDateDisplay = display;

    this.setDateInvalid(controlName, false);
    this.relationForm.get(controlName)?.setValue(value, { emitEvent: true });
  }

  private setDateInvalid(controlName: 'marriageDate' | 'separationDate' | 'firstSeenDate', invalid: boolean) {
    if (controlName === 'marriageDate')
      this.marriageDateInvalid.set(invalid);
    else if (controlName == 'separationDate')
      this.separationDateInvalid.set(invalid);
    else if (controlName == 'firstSeenDate')
      this.firstSeenDateInvalid.set(invalid);
  }
  // #endregion
}
