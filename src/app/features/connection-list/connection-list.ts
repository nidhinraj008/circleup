import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonData } from '../../core/services/common-data';
import { Configurations } from '../../core/types/configuration';
import { FireService } from '../../core/services/fire-service';
import { AppState } from '../../core/store/app.state';
import { Store } from '@ngrx/store';
import { selectConnectionsWithAge } from '../../core/features/connections';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-connection-list',
  imports: [
    AsyncPipe
  ],
  templateUrl: './connection-list.html',
  styleUrl: './connection-list.scss',
})
export class ConnectionList implements OnInit {

  connectionsList: any[] = []
  connections$: any;

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

  private setLayout(configuration: Configurations) {
    this.commonData.configurations.set(configuration);
  }

  public onClickItem(item: any) {
    this.router.navigate(['connections/view'], { queryParams: { id: item.id } });
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
