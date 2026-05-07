import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonData } from '../../shared/services/common-data';
import { menuItems } from '../../shared/data/menu-items';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
// import { PullToRefresh } from '../../shared/components/pull-to-refresh/pull-to-refresh';

@Component({
  selector: 'app-horizontal-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    // PullToRefresh
  ],
  templateUrl: './horizontal-layout.html',
  styleUrl: './horizontal-layout.scss',
})
export class HorizontalLayout implements OnInit {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  pageTitle = signal(null)
  menuItems = menuItems;

  private routerEvents = toSignal(this.router.events.pipe(filter(e => e instanceof NavigationEnd)), { initialValue: null });
  private routeConfig = computed(() => {
    this.routerEvents();
    let route = this.activatedRoute;
    while (route.firstChild) route = route.firstChild;
    return route.snapshot.data?.['config'];
  });

  constructor(
    public readonly commonData: CommonData,
    private location: Location
  ) {
    effect(() => {
      const config = this.routeConfig();
      this.pageTitle.set(config?.title ?? 'Circle Up')
      if (config) this.commonData.configurations.set(config);
    });
  }

  ngOnInit(): void {

  }

  public backClick() {
    this.location.back();
  }

  public onClickAdd() {
    this.commonData.onAddClick();
  }
}
