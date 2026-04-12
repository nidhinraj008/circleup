import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonData } from '../../shared/services/common-data';
import { FireService } from '../../shared/services/fire-service';
import { AppState } from '../../core/store/app.state';
import { Store } from '@ngrx/store';
import { selectConnectionsWithAge, removeConnection } from '../../core/features/connections';
import { AsyncPipe } from '@angular/common';
import { LongPressDirective } from '../../shared/directives/long-press';
declare var bootstrap: any;

@Component({
  selector: 'app-connection-list',
  imports: [
    AsyncPipe,
    LongPressDirective
  ],
  templateUrl: './connection-list.html',
  styleUrl: './connection-list.scss',
})
export class ConnectionList implements OnInit {

  connectionsList: any[] = []
  connections$: any;
  actionsModalInstance: any;
  deleteConfirmationModal: any;
  selectedItem: any;

  constructor(private readonly router: Router,
    private readonly commonData: CommonData,
    private fireService: FireService,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>
  ) {

  }

  ngOnInit(): void {   
    this.getAllConnections();
  }

  ngAfterViewInit() {
    this.actionsModalInstance = new bootstrap.Modal(document.getElementById('actionsModal'));
    this.deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
  }

  public onClickItem(item: any) {
    this.router.navigate(['connections/view', item.id]);
  }

  public onItemLongPress(item: any) {
    // event.preventDefault();
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

  public onClickEdit() {
    this.showOrHideActionsModal(false);
    this.router.navigate(['connections/edit', this.selectedItem.id])
  }
  
  public onClickDelete() {
    this.store.dispatch(removeConnection({ connectionId: this.selectedItem.id }));
    this.deleteConfirmationModal.hide();
    this.showOrHideActionsModal(false);
    this.getAllConnections();
  }
  
  public onClickClone() {
    this.showOrHideActionsModal(false);
    this.router.navigate(['connections/add', this.selectedItem.id])
  }


  private getAllConnections() {
    this.connections$ = this.store.select(selectConnectionsWithAge);

    // this.fireService.getAllConnections().subscribe(res => {
    //   if (!res) {
    //     return;
    //   }
    //   this.connectionsList = res.map((item: any) => {
    //     const dateOfBirth = item?.dateOfBirth?.seconds ? moment(item.dateOfBirth.seconds * 1000) : null;
    //     return {
    //       ...item,
    //       age: dateOfBirth ? moment().diff(dateOfBirth, 'years') : 0
    //     };
    //   });
    //   this.cdr.markForCheck();
    // });
  }

}
