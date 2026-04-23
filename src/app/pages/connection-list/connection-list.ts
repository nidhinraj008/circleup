import { AfterViewInit, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../core/store/app.state';
import { Store } from '@ngrx/store';
import { selectConnectionsWithAge, removeConnection } from '../../core/features/connections';
import { LongPressDirective } from '../../shared/directives/long-press';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { enumToArray } from '../../shared/functions/common-functions';
import { CommonData } from '../../shared/services/common-data';
import * as bootstrap from 'bootstrap';

export enum sortOptionsEnum {
  "Created Date: Latest" = 1,
  "Created Date: Earliest" = 2,
  "Name Ascending" = 3,
  "Name Descending" = 4,
}

@Component({
  selector: 'app-connection-list',
  imports: [
    LongPressDirective,
    ReactiveFormsModule
  ],
  templateUrl: './connection-list.html',
  styleUrl: './connection-list.scss',
})
export class ConnectionList implements OnInit, AfterViewInit {

  filterForm!: FormGroup;
  sortOptionsEnum = sortOptionsEnum;
  connectionsList = signal<any>([]);
  selectedItem: any;
  sortOptionsList = enumToArray(this.sortOptionsEnum);
  selectedSortOption = this.sortOptionsList[0];

  @ViewChild('sortingModal') sortingModalRef!: ElementRef;
  @ViewChild('actionsModal') actionsModalRef!: ElementRef;
  @ViewChild('deleteConfirmationModal') deleteConfirmationModalRef!: ElementRef;

  private sortingModalInstance!: bootstrap.Modal;
  private actionsModalInstance!: bootstrap.Modal;
  private deleteConfirmationModalInstance!: bootstrap.Modal;

  constructor(private readonly router: Router,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private commonData: CommonData
  ) {

  }

  ngOnInit(): void {
    this.initFilterForm()
    this.getAllConnections();
  }

  ngAfterViewInit() {
    this.sortingModalInstance = new bootstrap.Modal(this.sortingModalRef.nativeElement);
    this.actionsModalInstance = new bootstrap.Modal(this.actionsModalRef.nativeElement);
    this.deleteConfirmationModalInstance = new bootstrap.Modal(this.deleteConfirmationModalRef.nativeElement);
  }

  private initFilterForm() {
    this.filterForm = this.formBuilder.group({
      sortValue: [sortOptionsEnum["Created Date: Latest"]],
      searchValue: [],
    });

    this.filterForm.get("sortValue")?.valueChanges.subscribe(() => {
      this.sortConnections();
      this.showOrHideSortingModal(false)
    });
  }

  private sortConnections() {
    this.commonData.showLoader();
    const sortValue = this.filterForm.get('sortValue')?.value;
    let sortedList: any[] = [];
    if (sortValue == this.sortOptionsEnum["Created Date: Latest"]) {
      sortedList = this.connectionsList().sort((a: any, b: any) => b.id - a.id);
    } else if (sortValue == this.sortOptionsEnum["Created Date: Earliest"]) {
      sortedList = this.connectionsList().sort((a: any, b: any) => a.id - b.id);
    } else if (sortValue == this.sortOptionsEnum["Name Ascending"]) {
      sortedList = this.connectionsList().sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else if (sortValue == this.sortOptionsEnum["Name Descending"]) {
      sortedList = this.connectionsList().sort((a: any, b: any) => b.name.localeCompare(a.name));
    }
    this.connectionsList.set(sortedList);
    this.commonData.hideLoader();
  }

  public onClickItem(item: any) {
    this.router.navigate(['connections/view', item.id]);
  }

  public onItemLongPress(item: any) {
    this.selectedItem = item;
    this.showOrHideActionsModal(true);
  }

  public showOrHideSortingModal(visible: boolean) {
    if (visible) {
      this.sortingModalInstance.show();
    } else {
      this.sortingModalInstance.hide();
    }
  }

  public showOrHideActionsModal(visible: boolean) {
    if (visible) {
      this.actionsModalInstance.show();
    } else {
      this.actionsModalInstance.hide();
    }
  }

  public onClickEdit() {
    this.showOrHideActionsModal(false);
    this.router.navigate(['connections/edit', this.selectedItem.id])
  }

  public onClickDelete() {
    this.store.dispatch(removeConnection({ connectionId: this.selectedItem.id }));
    this.deleteConfirmationModalInstance.hide();
    this.showOrHideActionsModal(false);
    this.getAllConnections();
    this.commonData.success("Item deleted successfully");
  }

  public onClickClone() {
    this.showOrHideActionsModal(false);
    this.router.navigate(['connections/add', this.selectedItem.id])
  }

  private getAllConnections() {
    this.commonData.showLoader();
    this.store.select(selectConnectionsWithAge).subscribe({
      next: (res: any) => {
        this.connectionsList.set(res);
        this.sortConnections();
        this.commonData.hideLoader();
      },
      error: (err: any) => {
        this.commonData.hideLoader();
        this.commonData.error();
      }
    })
  }

}
