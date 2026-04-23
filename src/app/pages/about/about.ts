import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { APP_INFO } from '../../shared/data/app-info';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  appInfo = APP_INFO;
  description = 'CircleUp helps you manage families, connections, and relationships in a simple and meaningful way.';
}
