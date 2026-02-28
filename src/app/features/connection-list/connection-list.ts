import { Component } from '@angular/core';
import { HorizontalMenuBar } from '../../shared/horizontal-menu-bar/horizontal-menu-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connection-list',
  imports: [
    HorizontalMenuBar
  ],
  templateUrl: './connection-list.html',
  styleUrl: './connection-list.scss',
})
export class ConnectionList {

  constructor(private readonly router: Router) {

  }

  public onClickAdd() {
    this.router.navigate(['/connections/add']);
  }

}
