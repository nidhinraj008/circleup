import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  public isDarkMode = signal<boolean>(false);

  constructor() {
    // Load saved theme on startup
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      this.isDarkMode.set(false);
    }

    // Effect to apply changes dynamically to document element
    effect(() => {
      const dark = this.isDarkMode();
      if (dark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(this.THEME_KEY, 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(this.THEME_KEY, 'light');
      }

      // Automatically update all existing images on theme change
      const images = document.querySelectorAll('img');
      images.forEach(img => this.updateImageSrc(img, dark));
    });

    // Observe dynamic changes in the DOM to update newly added/changed images
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        const dark = this.isDarkMode();
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLImageElement) {
                this.updateImageSrc(node, dark);
              } else if (node instanceof HTMLElement) {
                const imgs = node.querySelectorAll('img');
                imgs.forEach(img => this.updateImageSrc(img, dark));
              }
            });
          } else if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
            const img = mutation.target as HTMLImageElement;
            this.updateImageSrc(img, dark);
          }
        });
      });

      // Start observing once the DOM body is fully ready
      setTimeout(() => {
        if (document.body) {
          observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
          });
        }
      });
    }
  }

  private updateImageSrc(img: HTMLImageElement, isDark: boolean) {
    const src = img.getAttribute('src');
    if (!src) return;

    if (isDark) {
      if (src.endsWith('/images/no-image.png')) {
        img.setAttribute('src', '/images/no-image-dark.png');
      } else if (src.endsWith('/images/unsupported.png')) {
        img.setAttribute('src', '/images/unsupported-dark.png');
      }
    } else {
      if (src.endsWith('/images/no-image-dark.png')) {
        img.setAttribute('src', '/images/no-image.png');
      } else if (src.endsWith('/images/unsupported-dark.png')) {
        img.setAttribute('src', '/images/unsupported.png');
      }
    }
  }

  public toggleTheme() {
    this.isDarkMode.update(dark => !dark);
  }
}
