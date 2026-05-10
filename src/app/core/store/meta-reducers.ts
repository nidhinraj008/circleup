import { ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['persons', 'authentication', 'families', 'partners', 'familyMembers', 'relations'], rehydrate: true })(reducer);
}

export const metaReducers: MetaReducer[] = [localStorageSyncReducer];