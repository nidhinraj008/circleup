import { createSelector } from '@ngrx/store';
import { AppState } from '../../store/app.state';

export const selectConnectionsState = (state: AppState) => state.partners;

/* id selector */
export const selectPartnerIds = createSelector(selectConnectionsState, state => state.ids);

/* entity selector */
export const selectPartnerEntities = createSelector(selectConnectionsState, state => state.entities);

/* get largest id */
export const selectLargestPartnerId = createSelector(
    selectPartnerIds,
    (ids) => ids.length ? Math.max(...ids.map(Number)) : 0
);

/* get by id*/
export const selectPartnerById = (id: number) => createSelector(
    selectPartnerEntities, 
    entities => entities[id]
);

/* get all */
export const selectAllFamilies = createSelector(
    selectPartnerIds,
    selectPartnerEntities,
    (ids, entities) => ids.map(id => ({
        ...entities[id]
    }))
);

