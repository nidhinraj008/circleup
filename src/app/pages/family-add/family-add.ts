import { Component, effect } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDEnum } from '../../shared/enum/crud.enum';
import { addFamily, selectFamilyById, selectLargestFamilyId, updateFamily } from '../../core/features/family'
import { selectPersonsWithAge } from '../../core/features/persons'
import { take } from 'rxjs';
import { CommonData } from '../../shared/services/common-data';
import { addFamilyMember, removeFamilyMembersByFamilyId, selectLargestFamilyMemberId, selectFamilyMembersByFamilyId } from '../../core/features/family-members'
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-family-add',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AsyncPipe
  ],
  templateUrl: './family-add.html',
  styleUrl: './family-add.scss',
})
export class FamilyAdd {

  familyForm!: FormGroup;
  currentMode!: CRUDEnum;
  personsList$: any;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private commonData: CommonData
  ) {
    let previousCount = this.commonData.submitCount();
    effect(() => {
      const count = this.commonData.submitCount();
      if (count > previousCount) {
        this.onClickSubmit();
      }
    });
  }

  ngOnInit(): void {
    this.initFamilyForm();
    this.getRouterData();
    this.personsList$ = this.store.select(selectPersonsWithAge);
  }

  private initFamilyForm(data?: any, members?: number[]) {
    this.familyForm = this.formBuilder.group({
      id: [data?.id ?? null],
      name: [data?.name ?? null, Validators.required],
      members: [members ?? []]
    })
  }

  get familyFormControls() {
    return this.familyForm.controls;
  }

  private getRouterData() {
    this.activatedRoute.data.subscribe(data => {
      this.currentMode = data['mode'];
      const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
      if (id > 0) {
        this.getFamilyData(id);
      }
    })
  }

  private getFamilyData(id: number) {
    this.store.select(selectFamilyById(id)).pipe(take(1)).subscribe({
      next: (familyRes: any) => {
        this.store.select(selectFamilyMembersByFamilyId(id)).pipe(take(1)).subscribe(familyMembers => {
          const members = familyMembers.map(fm => fm.personId);
          this.initFamilyForm(familyRes, members);
        });
      }
    });
  }

  public onClickSubmit() {
    this.familyForm.markAllAsTouched();
    if (this.familyForm.invalid) {
      this.commonData.warning("Invalid data");
      return;
    }
    let family = { ...this.familyForm.value };
    const memberIds: number[] = family.members || [];
    delete family.members;

    if (this.currentMode == CRUDEnum.Create) {
      this.store.select(selectLargestFamilyId).pipe(take(1)).subscribe(id => {
        const newFamilyId = id + 1;
        family.id = newFamilyId;
        this.store.dispatch(addFamily({ family }));
        this.saveFamilyMembers(newFamilyId, memberIds);
        this.commonData.success("Item added successfully");
        this.router.navigate(['families']);
      });
    } else {
      this.store.dispatch(updateFamily({ family }))
      this.saveFamilyMembers(family.id, memberIds);
      this.commonData.success("Item updated successfully");
      this.router.navigate(['families']);
    }
  }

  private saveFamilyMembers(familyId: number, memberIds: number[]) {
    this.store.dispatch(removeFamilyMembersByFamilyId({ familyId }));
    this.store.select(selectLargestFamilyMemberId).pipe(take(1)).subscribe(largestId => {
      let currentId = largestId;
      memberIds.forEach(personId => {
        currentId++;
        this.store.dispatch(addFamilyMember({ familyMember: { id: currentId, familyId, personId } }));
      });
    });
  }
}
