import { createSelector } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { calculateAge } from '../../../shared/functions/common-functions';
import { GenderEnum } from '../../../shared/enum/gender.enum';
import { selectFamilyEntities } from '../family';
import { selectAllFamilyMembers } from '../family-members';

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
    selectAllFamilyMembers,
    (entities, families, familyMembers) => {
        const entity = entities[id];
        if (!entity) return null;
        
        const personFamilyMembers = familyMembers.filter(fm => fm.personId === id);
        const personFamilies = personFamilyMembers.map(fm => families[fm.familyId]).filter(f => !!f);
        const familyName = personFamilies.map(f => f.name).join(', ') || null;

        const father = entity.fatherId ? entities[entity.fatherId] : null;
        const mother = entity.motherId ? entities[entity.motherId] : null;
        return {
            ...entity,
            familyName: familyName,
            families: personFamilies,
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
    selectPersonsEntities,
    selectAllFamilyMembers,
    (entities, familyMembers) => {
        const personIdsInFamily = familyMembers.filter(fm => fm.familyId === familyId).map(fm => fm.personId);
        return personIdsInFamily.map(id => {
            const entity = entities[id];
            if (!entity) return null;
            return {
                ...entity,
                age: calculateAge(entity.status, entity.dateOfBirth, entity.deathDate)
            };
        }).filter(p => !!p);
    }
);
