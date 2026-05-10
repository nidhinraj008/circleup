import { Component, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/app.state';
import { selectAllRelationsWithNames } from '../store/relation.selectors';
import { removeRelation } from '../store/relation.actions';
import { Router } from '@angular/router';
import { CommonData } from '../../../shared/services/common-data';
import { Modal } from '../../../shared/components/modal/modal';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LongPressDirective } from '../../../shared/directives/long-press';

@Component({
  selector: 'app-relations',
  imports: [
    Modal,
    DatePipe,
    LongPressDirective
  ],
  templateUrl: './relations.html',
  styleUrl: './relations.scss',
})
export class Relations {

  relationsList = signal<any[]>([]);
  selectedItem: any = null;
  showActionsModal: boolean = false;
  showDeleteConfirmationModal: boolean = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    public commonData: CommonData
  ) {
    this.store.select(selectAllRelationsWithNames).pipe(takeUntilDestroyed()).subscribe(res => {
      this.relationsList.set(res);
    });
  }

  public onClickItem(item: any) {
    this.router.navigate(['relations/view', item.id]);
  }

  public onItemLongPress(item: any) {
    this.selectedItem = item;
    this.showActionsModal = true;
  }

  public onClickEdit() {
    this.showActionsModal = false;
    this.router.navigate(['relations/edit', this.selectedItem.id]);
  }

  public onClickDelete() {
    this.store.dispatch(removeRelation({ relationId: this.selectedItem.id }));
    this.showDeleteConfirmationModal = false;
    this.showActionsModal = false;
  }
}
