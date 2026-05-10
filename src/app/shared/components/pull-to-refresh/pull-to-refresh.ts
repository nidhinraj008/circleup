import { Component, ElementRef, HostListener, input, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-pull-to-refresh',
  templateUrl: './pull-to-refresh.html',
  styleUrl: './pull-to-refresh.scss',
})
export class PullToRefresh {
  public disabled = input<boolean>(false);
  protected readonly Math = Math;
  private container = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  protected readonly pullDistance = signal(0);
  protected readonly isRefreshing = signal(false);
  private startY = 0;
  private readonly threshold = 80;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (this.disabled()) return;
    const el = this.container()?.nativeElement;
    if (el && el.scrollTop === 0) {
      this.startY = event.touches[0].pageY;
    } else {
      this.startY = 0;
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.disabled()) return;
    if (this.startY > 0 && !this.isRefreshing()) {
      const currentY = event.touches[0].pageY;
      const diff = currentY - this.startY;

      if (diff > 0) {
        // Logarithmic-like resistance for "rubber band" effect
        const distance = Math.pow(diff, 0.85);
        this.pullDistance.set(distance);

        // Prevent scrolling when pulling
        if (distance > 10 && event.cancelable) {
          event.preventDefault();
        }
      }
    }
  }

  @HostListener('touchend')
  onTouchEnd() {
    if (this.startY > 0 && this.pullDistance() >= this.threshold) {
      this.triggerReload();
    } else {
      this.reset();
    }
    this.startY = 0;
  }

  private triggerReload() {
    this.isRefreshing.set(true);
    // Give it a tiny bit of time to show the "refreshing" state before reload
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  private reset() {
    this.pullDistance.set(0);
  }
}
