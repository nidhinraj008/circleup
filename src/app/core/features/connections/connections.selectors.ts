import { createSelector } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { calculateAge } from '../../functions/common-functions';
import { GenderEnum } from '../../enum/gender.enum';

export const selectConnectionsState = (state: AppState) => state.connections;

/* id selector */
export const selectConnectionsIds = createSelector(selectConnectionsState, state => state.ids);

/* entity selector */
export const selectConnectionsEntities = createSelector(selectConnectionsState, state => state.entities);

/* get by id*/
export const selectConnectionsById = (id: number) => createSelector(
    selectConnectionsEntities, 
    entities => entities[id]
);

/* get by all with age*/
export const selectConnectionsWithAge = createSelector(
    selectConnectionsIds,
    selectConnectionsEntities,
    (ids, entities) => ids.map(id => ({
        ...entities[id],
        age: calculateAge(entities[id].status, entities[id].dateOfBirth, entities[id].deathDate)
    }))
);

/* get by all with gender filter*/
export const selectConnectionsByGender = (gender: GenderEnum) => createSelector(
    selectConnectionsIds, 
    selectConnectionsEntities,
    (ids, entities) => ids.map(id => entities[id])
    .filter(connection => connection.gender === gender)
);

/* get largest id */
export const selectLargestId = createSelector(
    selectConnectionsIds,
    (ids) => ids.length ? Math.max(...ids.map(Number)) : 0
);