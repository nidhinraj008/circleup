import { Component, OnInit } from '@angular/core';
import { CommonData } from '../../core/services/common-data';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  constructor(private readonly commonData: CommonData) {

  }

  ngOnInit(): void {
    this.setLayout();
  }

  private setLayout() {
    this.commonData.configurations.set({
      isShowMenuBar: true,
      isShowAdd: false,
    });
  }

}
