import { Component, OnInit, signal } from '@angular/core';
import { CommonData } from '../../shared/services/common-data';
import { interval } from 'rxjs';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  interval: any;
  currentDate = signal(new Date());
  batteryLevel = 0;
  isCharging = false;
  totalDaysInYear = 0;
  remainingDays = 0;
  progress = 0;
  dringCount = 0;

  constructor(private readonly commonData: CommonData) {

  }

  ngOnInit(): void {
    this.initialCall();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  private initialCall() {
    this.interval = interval(1000).subscribe(() => {
      this.currentDate.set(new Date());
    })

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        this.batteryLevel = battery.level * 100;
        this.isCharging = battery.charging;
        battery.addEventListener('levelchange', () => {
          this.batteryLevel = battery.level * 100;
        });
        battery.addEventListener('chargingchange', () => {
          this.isCharging = battery.charging;
        });
      });
    } 

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
    if(action) {
      this.dringCount++;
    } else {
      this.dringCount--;
    }
  }

}
