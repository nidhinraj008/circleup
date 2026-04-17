import { Component, inject } from '@angular/core';
import { CommonData } from '../../services/common-data';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {
  commonDataService = inject(CommonData);
}