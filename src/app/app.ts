import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapacitorApp } from '@capacitor/app';
import { Loader } from './shared/components/loader/loader';
import { Toast } from './shared/components/toast/toast';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Loader,
    Toast
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('circleup');
  private readonly themeService = inject(ThemeService);

  ngOnInit(): void {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000)

    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        if (confirm('Exit app?')) {
          CapacitorApp.exitApp();
        }
      }
    });
  }
}
