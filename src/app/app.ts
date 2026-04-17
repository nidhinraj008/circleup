import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { Loader } from './shared/components/loader/loader';
import { Toast } from './shared/components/toast/toast';

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

  ngOnInit(): void {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000)
  }
}
