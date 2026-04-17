import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { removeFamily, selectAllFamiliesWithMembersCount } from '../../core/features/family';
import { AppState } from '../../core/store/app.state';
import { Store } from '@ngrx/store';
import { Family } from '../../shared/types/family';
import { LongPressDirective } from '../../shared/directives/long-press';
declare var bootstrap: any;

@Component({
  selector: 'app-families',
  imports: [
    RouterLink,
    LongPressDirective
  ],
  templateUrl: './families.html',
  styleUrl: './families.scss',
})
export class Families {

  myFamily!: any;
  familiesList: any[] = []
  actionsModalInstance: any;
  deleteConfirmationModal: any;
  selectedItem: any;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.getAllFamilies();
  }

  ngAfterViewInit() {
    this.actionsModalInstance = new bootstrap.Modal(document.getElementById('actionsModal'));
    this.deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
  }

  public onClickItem(item: any) {
    this.router.navigate(['familyTree'], item.id)
  }

  public onItemLongPress(item: any) {
    this.selectedItem = item;
    this.showOrHideActionsModal(true);
  }

  public showOrHideActionsModal(visible: boolean) {
    if (visible) {
      this.actionsModalInstance.show();
    } else {
        this.actionsModalInstance.hide();
    }
  }

  private getAllFamilies() {
    this.store.select(selectAllFamiliesWithMembersCount).subscribe({
      next: (res: any) => {
        [this.myFamily, ...this.familiesList] = res;
      }
    })
  }

  public onClickDelete() {
    this.store.dispatch(removeFamily({ familyId: this.selectedItem.id }));
    this.deleteConfirmationModal.hide();
    this.showOrHideActionsModal(false);
    this.getAllFamilies();
  }
  
  public onClickEdit() {
    this.showOrHideActionsModal(false);
    this.router.navigate(['family/edit', this.selectedItem.id])
  }

}
