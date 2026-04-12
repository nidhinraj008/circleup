import { Injectable, signal } from '@angular/core';
import { Configurations } from '../types/configuration';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommonData {
  configurations = signal<Configurations>({ 
    isShowMenuBar: true,
    isShowAdd: false
  });

  constructor(private readonly router: Router) {

  }

  public onAddClick() {
    const url = this.router.url;
    if(url.includes('connections')) {
      this.router.navigate(['connections/add', 0]);
    }

  }
}
