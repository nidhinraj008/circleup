import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[longPress]'
})
export class LongPressDirective {

  @Input() pressDuration = 500;
  @Input() moveThreshold = 10;
  @Output() onLongPress = new EventEmitter<void>();
  @Output() onLongPressEnd = new EventEmitter<void>();

  private timer: any;
  private isLongPress = false;
  private startX = 0;
  private startY = 0;
  private isMoved = false;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.isLongPress = false;
    this.isMoved = false;
    const touch = event.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.timer = setTimeout(() => {
      if (!this.isMoved) {
        this.isLongPress = true;
        navigator?.vibrate?.(30);
        this.onLongPress.emit();
      }
    }, this.pressDuration);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    const touch = event.touches[0];
    const dx = Math.abs(touch.clientX - this.startX);
    const dy = Math.abs(touch.clientY - this.startY);
    if (dx > this.moveThreshold || dy > this.moveThreshold) {
      this.isMoved = true;
      clearTimeout(this.timer);
    }
  }

  @HostListener('touchend')
  @HostListener('touchcancel')
  onTouchEnd() {
    clearTimeout(this.timer);
    if (this.isLongPress && !this.isMoved) {
      this.onLongPressEnd.emit();
    }
    this.isLongPress = false;
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.isLongPress) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}