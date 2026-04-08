import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[longPress]'
})
export class LongPressDirective {

  @Input() pressDuration = 500;
  @Output() longPress = new EventEmitter<void>();

  private timer: any;
  private isLongPress = false;

  @HostListener('touchstart')
  onTouchStart() {
    this.isLongPress = false;

    this.timer = setTimeout(() => {
      this.isLongPress = true;
      navigator.vibrate?.(30);
      this.longPress.emit();
    }, this.pressDuration);
  }

  @HostListener('touchend')
  @HostListener('touchcancel')
  onTouchEnd() {
    clearTimeout(this.timer);
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.isLongPress) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}