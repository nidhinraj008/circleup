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

}
