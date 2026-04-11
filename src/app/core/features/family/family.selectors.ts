import { createSelector } from '@ngrx/store';
import { AppState } from '../../store/app.state';

export const selectConnectionsState = (state: AppState) => state.families;

/* id selector */
export const selectFamilyIds = createSelector(selectConnectionsState, state => state.ids);

/* entity selector */
export const selectFamilyEntities = createSelector(selectConnectionsState, state => state.entities);

/* get by id*/
export const selectFamilyById = (id: number) => createSelector(
    selectFamilyEntities, 
    entities => entities[id]
);

/* get all */
export const selectAllFamilies = createSelector(
    selectFamilyIds,
    selectFamilyEntities,
    (ids, entities) => ids.map(id => ({
        ...entities[id]
    }))
);

/* get largest id */
export const selectLargestFamilyId = createSelector(
    selectFamilyIds,
    (ids) => ids.length ? Math.max(...ids.map(Number)) : 0
);