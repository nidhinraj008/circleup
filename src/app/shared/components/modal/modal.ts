import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  title = input<string | null>(null);
  position = input<'center' | 'bottom'>('center');
  closeButtonLabel = input<string>('Close');
  processButtonLabel = input<string>('Process');
  saveButtonLabel = input<string>('Save');
  isVisible = input<boolean>(false);
  showClose = input<boolean>(false);
  showCloseButton = input<boolean>(false);
  showProcessButton = input<boolean>(false);
  showSaveButton = input<boolean>(false);
  close = output<boolean>();
  process = output<void>();
  save = output<void>();

  public onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit(false);
    }
  }
}
