import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../core/store/app.state';
import { Store } from '@ngrx/store';
import { selectPersonsWithAge, removePerson } from '../../core/features/persons';
import { LongPressDirective } from '../../shared/directives/long-press';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { enumToArray } from '../../shared/functions/common-functions';
import { CommonData } from '../../shared/services/common-data';
import { Modal } from '../../shared/components/modal/modal';

export enum sortOptionsEnum {
  "Created Date: Latest" = 1,
  "Created Date: Earliest" = 2,
  "Name Ascending" = 3,
  "Name Descending" = 4,
}

@Component({
  selector: 'app-person-list',
  imports: [
    LongPressDirective,
    ReactiveFormsModule,
    Modal
  ],
  templateUrl: './person-list.html',
  styleUrl: './person-list.scss',
})
export class PersonList implements OnInit {

  filterForm!: FormGroup;
  sortOptionsEnum = sortOptionsEnum;
  personsList = signal<any>([]);
  selectedItem: any;
  sortOptionsList = enumToArray(this.sortOptionsEnum);
  selectedSortOption = this.sortOptionsList[0];
  showSortingModal: boolean = false;
  showActionsModal: boolean = false;
  showDeleteConfirmationModal: boolean = false;

  constructor(private readonly router: Router,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private commonData: CommonData
  ) { }

  ngOnInit(): void {
    this.initFilterForm()
    this.getAllPersons();
  }

  private initFilterForm() {
    this.filterForm = this.formBuilder.group({
      sortValue: [sortOptionsEnum["Created Date: Latest"]],
      searchValue: [],
    });

    this.filterForm.get("sortValue")?.valueChanges.subscribe(() => {
      this.sortPersons();
      this.showSortingModal = false
    });
  }

  private sortPersons() {
    this.commonData.showLoader();
    const sortValue = this.filterForm.get('sortValue')?.value;
    let sortedList: any[] = [];
    if (sortValue == this.sortOptionsEnum["Created Date: Latest"]) {
      sortedList = this.personsList().sort((a: any, b: any) => b.id - a.id);
    } else if (sortValue == this.sortOptionsEnum["Created Date: Earliest"]) {
      sortedList = this.personsList().sort((a: any, b: any) => a.id - b.id);
    } else if (sortValue == this.sortOptionsEnum["Name Ascending"]) {
      sortedList = this.personsList().sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else if (sortValue == this.sortOptionsEnum["Name Descending"]) {
      sortedList = this.personsList().sort((a: any, b: any) => b.name.localeCompare(a.name));
    }
    this.personsList.set(sortedList);
    this.commonData.hideLoader();
  }

  public onClickItem(item: any) {
    this.router.navigate(['persons/view', item.id]);
  }

  public onItemLongPress(item: any) {
    this.selectedItem = item;
    this.showActionsModal = true;
  }

  public onClickEdit() {
    this.showActionsModal = false;
    this.router.navigate(['persons/edit', this.selectedItem.id])
  }

  public onClickDelete() {
    this.store.dispatch(removePerson({ personId: this.selectedItem.id }));
    this.showDeleteConfirmationModal = false;
    this.showActionsModal = false;
    this.getAllPersons();
    this.commonData.success("Item deleted successfully");
  }

  public onClickClone() {
    this.showActionsModal = false;
    this.router.navigate(['persons/add', this.selectedItem.id])
  }

  private getAllPersons() {
    this.commonData.showLoader();
    this.store.select(selectPersonsWithAge).subscribe({
      next: (res: any) => {
        this.personsList.set(res);
        this.sortPersons();
        this.commonData.hideLoader();
      },
      error: (err: any) => {
        this.commonData.hideLoader();
        this.commonData.error();
      }
    })
  }
}