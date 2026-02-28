import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonData } from '../../core/services/common-data';

@Component({
  selector: 'app-horizontal-layout',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './horizontal-layout.html',
  styleUrl: './horizontal-layout.scss',
})
export class HorizontalLayout {

  menuItems = [
    {
      label: "Home",
      icon: "bi bi-house",
      routerLink: ['/dashboard']
    },
    {
      label: "Connections",
      icon: "bi bi-people",
      routerLink: ['/connections']
    },
    {
      label: "Family Tree",
      icon: "bi bi-diagram-2",
      routerLink: ['/familyTree']
    },
    {
      label: "Profile",
      icon: "bi bi-person",
      routerLink: ['/profile']
    },
  ];

  constructor(private readonly commonData: CommonData) {

  }

  public onClickAdd() {
    this.commonData.onAddClick();
  }
}
