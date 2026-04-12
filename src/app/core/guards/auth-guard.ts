import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectConnectionsById } from '../features/connections';
import { myFamily, primaryConnection } from '../../shared/data/primary';
import { combineLatest, map, take } from 'rxjs';
import { selectFamilyById } from '../features/family';

export const authGuard: CanActivateChildFn = () => {
  const store = inject(Store);
  const router = inject(Router)

  return combineLatest([
    store.select(selectConnectionsById(primaryConnection.id)),
    store.select(selectFamilyById(myFamily.id))
  ]).pipe(
    map(([user, family]) => {
      if (!user?.id || !family) {
        return router.createUrlTree(['/initial']); 
      }
      return true;
    }),
    take(1)
  );

};
