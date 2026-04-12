import { Component } from '@angular/core';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { selectAllByFamilyId } from '../../core/features/connections';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/app.state';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-family-tree',
  imports: [
    NgxGraphModule,
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

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.getRouterData();
  }

  private getRouterData() {
    this.activatedRoute.paramMap.subscribe(data => {
      const id = Number(data.get("id") ?? '0');
      if (id > 0) {
        this.getAllByFamilyId(id);
      }
    })
  }

  private processTreeData() {
    const weddingSet = new Set<string>()
    const nodes: any[] = []
    const links: any[] = []

    for(let item of this.treeData) {
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
