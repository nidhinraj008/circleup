import { Component, DestroyRef, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/app.state';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { selectRelationWithDetails } from '../store';
import { RelationStatusEnum } from '../../../shared/enum/relation-status.enum';
import { DatePipe } from '@angular/common';
import { CommonData } from '../../../shared/services/common-data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-relation-view',
  imports: [
    DatePipe,
    RouterLink
  ],
  templateUrl: './relation-view.html',
  styleUrl: './relation-view.scss',
})
export class RelationView {

  relationDetails = signal<any>(null);
  statusEnum = RelationStatusEnum;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private commonData: CommonData,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    this.commonData.editClick$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      const relation = this.relationDetails();
      relation && this.router.navigate(['relations/edit', relation.id]);
    });
  }

  ngOnInit(): void {
    this.getRouterData();
  }

  private getRouterData() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.getRelationData(id);
      }
    })
  }

  private getRelationData(id: number) {
    this.store.select(selectRelationWithDetails(id)).subscribe({
      next: (res: any) => {
        this.relationDetails.set(res);
      }
    })
  }
}
