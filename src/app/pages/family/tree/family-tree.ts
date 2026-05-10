import { Component, DestroyRef, signal } from '@angular/core';
import { NgxGraphModule, NgxGraphZoomOptions } from '@swimlane/ngx-graph';
import { selectAllByFamilyId } from '../../person/store';
import { selectAllRelations } from '../../relation/store';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { combineLatest, Subject } from 'rxjs';
import { CommonData } from '../../../shared/services/common-data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-family-tree',
  imports: [
    NgxGraphModule,
    DecimalPipe,
  ],
  templateUrl: './family-tree.html',
  styleUrl: './family-tree.scss',
})
export class FamilyTree {

  treeData: any[] = [];
  relations: any[] = [];
  personNodes: any[] = [];
  personLinks: any[] = [];
  familyId: number = 0;
  layoutSettings = {
    orientation: 'TB',
    rankPadding: 80,
    nodePadding: 200,
  };

  minZoomLevel = 0.1;
  maxZoomLevel = 5;
  zoomLevel = signal<number>(1);
  zoomToFit$: Subject<NgxGraphZoomOptions> = new Subject();

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private commonData: CommonData,
    private destroyRef: DestroyRef

  ) {
    this.commonData.editClick$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.familyId && this.router.navigate(['family/edit', this.familyId]);
    });
  }

  ngOnInit(): void {
    this.getRouterData();
  }

  public fitGraph() {
    this.zoomToFit$.next({ force: true, autoCenter: true });
    this.zoomLevel.set(1)
  }

  private getRouterData() {
    this.activatedRoute.paramMap.subscribe(data => {
      this.familyId = Number(data.get("id") ?? '0');
      if (this.familyId > 0) {
        this.getData(this.familyId);
      }
    })
  }

  public onClickZoom(isZoom: boolean) {
    if (isZoom && this.zoomLevel() < this.maxZoomLevel) {
      this.zoomLevel.update(zoom => (zoom * 10 + 1) / 10);
    } else if (!isZoom && this.zoomLevel() > this.minZoomLevel) {
      this.zoomLevel.update(zoom => (zoom * 10 - 1) / 10);
    }
  }

  public resetZoom() {
    this.zoomLevel.set(1);
  }

  public onClickPerson(person: any) {
    const id = person.id.replace('id', '');
    this.router.navigate(['persons/view', id]);
  }

  public onClickJunction(person: any) {

  }

  private processTreeData() {
    const weddingSet = new Set<string>()
    const nodes: any[] = []
    const links: any[] = []

    // Map treeData for easy lookup
    const personIds = new Set(this.treeData.map(p => p.id));

    for (let item of this.treeData) {
      nodes.push({ ...item, id: `id${item.id}`, label: item.name });

      // junction based on parent-child relationship (original logic)
      if (item.fatherId && item.motherId) {
        const key = `${item.fatherId}W${item.motherId}`;
        if (!weddingSet.has(key)) {
          weddingSet.add(key);
          nodes.push({ id: key, label: 'junction', name: "junction", fatherId: null, motherId: null })
          links.push({ source: `id${item.fatherId}`, target: key });
          links.push({ source: `id${item.motherId}`, target: key });
        }
        links.push({ source: key, target: `id${item.id}` });
      } else if (item.fatherId || item.motherId) {
        // Handle single parent cases
        const parentId = item.fatherId || item.motherId;
        links.push({ source: `id${parentId}`, target: `id${item.id}` });
      }
    }

    // Add junctions for explicit Relation records (for childless couples)
    for (let relation of this.relations) {
      const p1Id = Number(relation.maleId);
      const p2Id = Number(relation.femaleId);

      // only add if both persons are in the current family tree
      if (personIds.has(p1Id) && personIds.has(p2Id)) {
        const key = `${p1Id}W${p2Id}`;
        if (!weddingSet.has(key)) {
          weddingSet.add(key);
          nodes.push({ id: key, label: 'junction', name: "junction", fatherId: null, motherId: null })
          links.push({ source: `id${p1Id}`, target: key });
          links.push({ source: `id${p2Id}`, target: key });
        }
      }
    }

    this.personLinks = links;
    this.personNodes = nodes;
    setTimeout(() => {
      this.fitGraph();
    }, 10);
  }

  private getData(id: number) {
    combineLatest([
      this.store.select(selectAllByFamilyId(id)),
      this.store.select(selectAllRelations)
    ]).subscribe({
      next: ([persons, relations]: [any[], any[]]) => {
        this.treeData = persons;
        this.relations = relations;
        this.processTreeData();
      }
    })
  }
}
