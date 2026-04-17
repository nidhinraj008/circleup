import { Component, inject } from '@angular/core';
import { CommonData } from '../../services/common-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [
    CommonModule
  ],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  commonData = inject(CommonData)
}