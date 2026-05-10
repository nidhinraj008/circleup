import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectPersonsById } from '../../pages/person/store';
import { myFamily, primaryPerson } from '../../shared/data/primary';
import { combineLatest, map, take } from 'rxjs';
import { selectFamilyById } from '../../pages/family/store';

export const authGuard: CanActivateChildFn = () => {
  const store = inject(Store);
  const router = inject(Router)

  return combineLatest([
    store.select(selectPersonsById(primaryPerson.id)),
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
