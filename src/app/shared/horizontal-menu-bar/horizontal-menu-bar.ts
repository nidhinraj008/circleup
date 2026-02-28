import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonData } from '../../core/services/common-data';

@Component({
  selector: 'app-horizontal-menu-bar',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './horizontal-menu-bar.html',
  styleUrl: './horizontal-menu-bar.scss',
})
export class HorizontalMenuBar {

  @Input() isShowAdd = false;

  @Output() addClicked = new EventEmitter();
  
  constructor(private readonly commonData: CommonData) {

  }

  public onClickAdd() {
    this.addClicked.emit(true);
  }
}
