import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonData {
  addTrigger = signal(false);

  public onAddClick() {
    this.addTrigger.update(v => !v);
  }
}
