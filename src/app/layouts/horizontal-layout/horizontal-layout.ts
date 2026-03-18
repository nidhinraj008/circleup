import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonData } from '../../core/services/common-data';
import { menuItems } from '../../core/data/menu-items';
import { filter } from 'rxjs';

@Component({
  selector: 'app-horizontal-layout',
  imports: [
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './horizontal-layout.html',
  styleUrl: './horizontal-layout.scss',
})
export class HorizontalLayout implements OnInit {

  isShowAdd: boolean = false;
  isShowMenuBar: boolean = false;

  menuItems = menuItems;

  configurations: any;


  constructor(
    private readonly commonData: CommonData,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.subscribeRouter();
    this.configurations = this.commonData.configurations;
  }


  public onClickAdd() {
    this.commonData.onAddClick();
  }

  private subscribeRouter() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const data = this.getDeepestRoute(this.activatedRoute).snapshot.data;
      if (data && data['config']) {
        this.commonData.configurations.set(data['config']);
      }
    });
  }

  private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
