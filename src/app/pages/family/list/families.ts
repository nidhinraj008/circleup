import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { removeFamily, selectAllFamiliesWithMembersCount } from '../store';
import { removeFamilyMembersByFamilyId } from '../store/family-members';
import { AppState } from '../../../core/store/app.state';
import { Store } from '@ngrx/store';
import { LongPressDirective } from '../../../shared/directives/long-press';
import { Modal } from '../../../shared/components/modal/modal';

@Component({
  selector: 'app-families',
  imports: [
    RouterLink,
    LongPressDirective,
    Modal,
  ],
  templateUrl: './families.html',
  styleUrl: './families.scss',
})
export class Families {

  myFamily!: any;
  familiesList: any[] = []
  selectedItem: any;
  showActionsModal: boolean = false;
  showDeleteConfirmationModal: boolean = false;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllFamilies();
  }

  public onClickItem(item: any) {
    this.router.navigate(['familyTree', item.id]);
  }

  public onItemLongPress(item: any) {
    this.selectedItem = item;
    this.showActionsModal = true;
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
    this.store.dispatch(removeFamilyMembersByFamilyId({ familyId: this.selectedItem.id }));
    this.showActionsModal = false;
    this.showDeleteConfirmationModal = false;
    this.getAllFamilies();
  }

  public onClickEdit() {
    this.showActionsModal = false;
    this.router.navigate(['family/edit', this.selectedItem.id])
  }
}