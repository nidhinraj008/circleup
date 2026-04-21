import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  appName = 'CircleUp';
  version = 'v1.0.0';
  description = 'CircleUp helps you manage families, connections, and relationships in a simple and meaningful way.';

}
