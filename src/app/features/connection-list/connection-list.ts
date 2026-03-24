import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonData } from '../../core/services/common-data';
import { Configurations } from '../../core/types/configuration';
import { FireService } from '../../core/services/fire-service';
import moment from 'moment';

@Component({
  selector: 'app-connection-list',
  imports: [
  ],
  templateUrl: './connection-list.html',
  styleUrl: './connection-list.scss',
})
export class ConnectionList implements OnInit {

  connectionsList: any[] = []

  constructor(private readonly router: Router,
    private readonly commonData: CommonData,
    private fireService: FireService,
    private cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    // this.setLayout({
    //   isShowMenuBar: true,
    //   isShowAdd: true,
    // });    
    this.getAllConnections();
  }

  private setLayout(configuration: Configurations) {
    this.commonData.configurations.set(configuration);
  }

  public onClickItem(item: any) {
    this.router.navigate(['connections/view'], { queryParams: { id: item.id } });
  }

  private getAllConnections() {
    this.fireService.getAllConnections().subscribe(res => {
      if (!res) {
        return;
      }
      this.connectionsList = res.map((item: any) => {
        const dateOfBirth = item?.dateOfBirth?.seconds ? moment(item.dateOfBirth.seconds * 1000) : null;
        return {
          ...item,
          age: dateOfBirth ? moment().diff(dateOfBirth, 'years') : 0
        };
      });
      this.cdr.markForCheck();
    });
  }

}
