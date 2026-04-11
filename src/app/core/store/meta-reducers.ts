import { ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['connections', 'authentication', 'families'], rehydrate: true })(reducer);
}

export const metaReducers: MetaReducer[] = [localStorageSyncReducer];