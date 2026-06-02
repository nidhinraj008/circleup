import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonData } from '../../shared/services/common-data';
import { RouterLink } from "@angular/router";
import { ThemeService } from '../../shared/services/theme.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  private readonly themeService = inject(ThemeService);
  public readonly isDarkMode = this.themeService.isDarkMode;

  totalDaysInYear = 0;
  remainingDays = 0;
  progress = 0;
  dringCount = 0;

  constructor(private readonly commonData: CommonData) {

  }

  public toggleTheme() {
    this.themeService.toggleTheme();
  }

  ngOnInit(): void {
    this.initialCall();
  }

  private initialCall() {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);
    this.totalDaysInYear = this.isLeapYear(year) ? 366 : 365;
    const diff = endOfYear.getTime() - now.getTime();
    this.remainingDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const progress = ((now.getTime() - startOfYear.getTime()) / (endOfYear.getTime() - startOfYear.getTime())) * 100;
    this.progress = Math.round(progress) / 1;
  }

  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  public drinkWater(action: number) {
    if (action) {
      this.dringCount++;
    } else {
      this.dringCount--;
    }
  }

}
