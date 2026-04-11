import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { selectAllFamilies } from '../../core/features/family';
import { AppState } from '../../core/store/app.state';
import { Store } from '@ngrx/store';
import { Family } from '../../core/types/family';

@Component({
  selector: 'app-families',
  imports: [RouterLink],
  templateUrl: './families.html',
  styleUrl: './families.scss',
})
export class Families {

  myFamily!: Family;
  familiesList: Family[] = []

  constructor(
    private store: Store<AppState>
  ) {

  }

  ngOnInit(): void {
    this.getAllFamilies();
  }

  private getAllFamilies() {
    this.store.select(selectAllFamilies).subscribe({
      next: (res: any) => {
        [this.myFamily, ...this.familiesList] = res;
      }
    })
  }
}
