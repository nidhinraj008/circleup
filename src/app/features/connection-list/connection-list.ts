import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonData } from '../../core/services/common-data';
import { Configurations } from '../../core/types/configuration';

@Component({
  selector: 'app-connection-list',
  imports: [
  ],
  templateUrl: './connection-list.html',
  styleUrl: './connection-list.scss',
})
export class ConnectionList implements OnInit {

  connectionsList = [
    { id: 1, name: 'Arjun', age: 28, image: '' },
    { id: 2, name: 'Meera', age: 24, image: '' },
    { id: 3, name: 'Rahul', age: 32, image: '' }
  ];

  constructor(private readonly router: Router,
    private readonly commonData: CommonData
  ) {

  }

  ngOnInit(): void {
    // this.setLayout({
    //   isShowMenuBar: true,
    //   isShowAdd: true,
    // });    
  }

  private setLayout(configuration: Configurations) {
    this.commonData.configurations.set(configuration);
  }

  public onClickItem(item: any) {
    this.router.navigate(['connections/view'], { queryParams: { id: item.id } });
  }

}
