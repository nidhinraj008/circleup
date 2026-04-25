import { Component, signal } from '@angular/core';
import { NgxGraphModule, NgxGraphZoomOptions } from '@swimlane/ngx-graph';
import { selectAllByFamilyId } from '../../core/features/connections';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-family-tree',
  imports: [
    NgxGraphModule,
    DecimalPipe
  ],
  templateUrl: './family-tree.html',
  styleUrl: './family-tree.scss',
})
export class FamilyTree {

  treeData: any[] = [];
  conectionNodes: any[] = [];
  connectionLinks: any[] = [];

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
  ) {
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
      const id = Number(data.get("id") ?? '0');
      if (id > 0) {
        this.getAllByFamilyId(id);
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

  private processTreeData() {
    const weddingSet = new Set<string>()
    const nodes: any[] = []
    const links: any[] = []

    for (let item of this.treeData) {
      nodes.push({ ...item, id: `id${item.id}`, label: item.name });

      // proseed only if father or mother is not null
      if (!item.fatherId && !item.motherId) {
        continue;
      }

      const key = `${item?.fatherId ?? 0}W${item?.motherId ?? 0}`;
      if (!weddingSet.has(key)) {
        weddingSet.add(key);

        // junction node insertion
        nodes.push({ id: key, label: 'junction', name: "junction", fatherId: null, motherId: null })

        // parent to junction link
        if (item?.fatherId)
          links.push({ source: `id${item.fatherId}`, target: key });
        if (item?.motherId)
          links.push({ source: `id${item.motherId}`, target: key });
      }

      // junction to child link
      links.push({ source: key, target: `id${item.id}` });
    }

    this.connectionLinks = links;
    this.conectionNodes = nodes;
    setTimeout(() => {
      this.fitGraph();
    }, 10);
  }

  private getAllByFamilyId(id: number) {
    this.store.select(selectAllByFamilyId(id)).subscribe({
      next: (res: any) => {
        this.treeData = res;
        this.processTreeData();
      }
    })
  }
}
