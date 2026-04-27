import { createSelector } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { calculateAge } from '../../../shared/functions/common-functions';
import { GenderEnum } from '../../../shared/enum/gender.enum';
import { selectFamilyEntities } from '../family';

export const selectPersonsState = (state: AppState) => state.persons;

/* id selector */
export const selectPersonsIds = createSelector(selectPersonsState, state => state.ids);

/* entity selector */
export const selectPersonsEntities = createSelector(selectPersonsState, state => state.entities);

/* get largest id */
export const selectLargestPersonId = createSelector(
    selectPersonsIds,
    (ids) => ids.length ? Math.max(...ids.map(Number)) : 0
);

/* get by id*/
export const selectPersonsById = (id: number) => createSelector(
    selectPersonsEntities, 
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
export const selectPersonsWithAge = createSelector(
    selectPersonsIds,
    selectPersonsEntities,
    (ids, entities) => ids.map(id => ({
        ...entities[id],
        age: calculateAge(entities[id].status, entities[id].dateOfBirth, entities[id].deathDate)
    }))
);

/* get by all with gender filter*/
export const selectPersonsByGender = (gender: GenderEnum) => createSelector(
    selectPersonsIds, 
    selectPersonsEntities,
    (ids, entities) => ids.map(id => entities[id])
    .filter(person => person.gender === gender)
);

/* list data for the tree */
export const selectAllByFamilyId = (familyId: number) => createSelector(
    selectPersonsIds,
    selectPersonsEntities,
    (ids, entities) => ids.map(id => ({
        ...entities[id],
        age: calculateAge(entities[id].status, entities[id].dateOfBirth, entities[id].deathDate)
    }))
        .filter(person => person?.familyId === familyId)
)
