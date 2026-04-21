import { Injectable, signal } from '@angular/core';
import { Configurations } from '../types/configuration';
import { Router } from '@angular/router';
import { Toast } from '../types/toast';
import { appMessages } from '../data/app-constants';

@Injectable({
  providedIn: 'root',
})
export class CommonData {

  configurations = signal<Configurations>({
    isShowMenuBar: true,
    isShowAdd: false
  });
  submitCount = signal<number>(0);
  isLoading = signal(false);
  requestCount: number = 0;

  private counter = 0;
  toasts = signal<Toast[]>([]);

  constructor(private readonly router: Router) {

  }

  public onAddClick() {
    const url = this.router.url;
    if (url.includes('connections')) {
      this.router.navigate(['connections/add', 0]);
    } else if (url.includes('families')) {
      this.router.navigate(['family/add'])
    }
  }

  public onSaveClick() {
    this.submitCount.update(v => v + 1);
  }

  //#region Loader
  public showLoader() {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.isLoading.set(true);
    }
  }

  public hideLoader() {
    if (this.requestCount > 0) {
      this.requestCount--;
    }
    if (this.requestCount === 0) {
      this.isLoading.set(false);
    }
  }

  public resetLoader() {
    this.requestCount = 0;
    this.isLoading.set(false);
  }
  // #endregion

  // #region Toast
  private showToast(message: string, type: Toast['type'] = 'info') {
    const id = ++this.counter;
    const newToast: Toast = { id, message, type };
    this.toasts.update(t => [...t, newToast]);
    setTimeout(() => this.remove(id), 3000);
  }

  public remove(id: number) {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }

  public success(msg: string = appMessages.success) {
    this.showToast(msg, 'success');
  }

  public error(msg: string = appMessages.error) {
    this.showToast(msg, 'error');
  }

  public info(msg: string = appMessages.info) {
    this.showToast(msg, 'info');
  }

  public warning(msg: string = appMessages.warning) {
    this.showToast(msg, 'warning');
  }
  // #endregion

}
