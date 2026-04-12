import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDEnum } from '../../shared/enum/crud.enum';
import { addFamily, selectFamilyById, selectLargestFamilyId, updateFamily } from '../../core/features/family'
import { selectAllByFamilyId } from '../../core/features/connections'
import { take } from 'rxjs';

@Component({
  selector: 'app-family-add',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './family-add.html',
  styleUrl: './family-add.scss',
})
export class FamilyAdd {

  familyForm!: FormGroup;
  currentMode!: CRUDEnum;

  familyMembers$: any;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initFamilyForm();
    this.getRouterData();
  }

  private initFamilyForm(data?: any) {
    this.familyForm = this.formBuilder.group({
      id: [data?.id ?? null],
      name: [data?.name ?? null, Validators.required]
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
    this.familyMembers$ = this.store.select(selectAllByFamilyId(id))
    this.store.select(selectFamilyById(id)).subscribe({
      next: (res: any) => {
        this.initFamilyForm(res);
      }
    })
  }

  public onClickSubmit() {
    this.familyForm.markAllAsTouched();
    if(this.familyForm.invalid) {
      return;
    }
    let family = this.familyForm.value;
    if (this.currentMode == CRUDEnum.Create) {
      this.store.select(selectLargestFamilyId).pipe(take(1)).subscribe(id => {
        family.id = id + 1;
        this.store.dispatch(addFamily({ family: this.familyForm.value }))
      });
    } else {
      this.store.dispatch(updateFamily({ family: this.familyForm.value }))
    }
    this.router.navigate(['families']);
  }
}
