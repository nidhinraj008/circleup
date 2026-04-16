import { createSelector } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { calculateAge } from '../../../shared/functions/common-functions';
import { GenderEnum } from '../../../shared/enum/gender.enum';
import { selectFamilyEntities } from '../family';

export const selectConnectionsState = (state: AppState) => state.connections;

/* id selector */
export const selectConnectionsIds = createSelector(selectConnectionsState, state => state.ids);

/* entity selector */
export const selectConnectionsEntities = createSelector(selectConnectionsState, state => state.entities);

/* get largest id */
export const selectLargestId = createSelector(
    selectConnectionsIds,
    (ids) => ids.length ? Math.max(...ids.map(Number)) : 0
);

/* get by id*/
export const selectConnectionsById = (id: number) => createSelector(
    selectConnectionsEntities, 
    selectFamilyEntities,
    (entities, families) => {
        const entity = entities[id];
        if (!entity) return null;
        const family = entity.familyId ? families[entity.familyId] : null;
        const father = entity.fatherId ? entities[entity.fatherId] : null;
        const mother = entity.motherId ? entities[entity.motherId] : null;
        return {
            ...entity,
            familyName: family?.name ?? null,
            fatherName: father?.name ?? null,
            motherName: mother?.name ?? null
        };
    }
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

/* list data for the tree */
export const selectAllByFamilyId = (familyId: number) => createSelector(
    selectConnectionsIds,
    selectConnectionsEntities,
    (ids, entities) => ids.map(id => ({
        ...entities[id],
        age: calculateAge(entities[id].status, entities[id].dateOfBirth, entities[id].deathDate)
    }))
        .filter(connection => connection?.familyId === familyId)
)