import { createSelector } from '@ngrx/store';
import { AppState } from '../../../core/store/app.state';

export const selectRelationsState = (state: AppState) => state.relations;

/* id selector */
export const selectRelationIds = createSelector(selectRelationsState, state => state.ids);

/* entity selector */
export const selectRelationEntities = createSelector(selectRelationsState, state => state.entities);

/* get largest id */
export const selectLargestRelationId = createSelector(
    selectRelationIds,
    (ids) => ids.length ? Math.max(...ids.map(Number)) : 0
);

/* get by id*/
export const selectRelationById = (id: number) => createSelector(
    selectRelationEntities,
    entities => entities[id]
);

/* get all */
export const selectAllRelations = createSelector(
    selectRelationIds,
    selectRelationEntities,
    (ids, entities) => ids.map(id => ({
        ...entities[id]
    }))
);

export const selectAllRelationsWithNames = createSelector(
    selectAllRelations,
    (state: AppState) => state.persons.entities,
    (relations, personEntities) => relations.map(relation => ({
        ...relation,
        person1Name: personEntities[Number(relation.maleId)]?.name ?? 'Unknown',
        person2Name: personEntities[Number(relation.femaleId)]?.name ?? 'Unknown',
        person1Image: personEntities[Number(relation.maleId)]?.primaryImageUrl,
        person2Image: personEntities[Number(relation.femaleId)]?.primaryImageUrl
    }))
);

export const selectRelationWithDetails = (id: number) => createSelector(
    selectRelationEntities,
    (state: AppState) => state.persons,
    (relationEntities, personsState) => {
        const relation = relationEntities[id];
        if (!relation) return null;

        const personEntities = personsState.entities;
        const allPersons = personsState.ids.map(pid => personEntities[pid]);

        const maleId = Number(relation.maleId);
        const femaleId = Number(relation.femaleId);

        const children = allPersons.filter(p => 
            Number(p?.fatherId) === maleId && Number(p?.motherId) === femaleId
        );

        return {
            ...relation,
            maleName: personEntities[maleId]?.name ?? 'Unknown',
            femaleName: personEntities[femaleId]?.name ?? 'Unknown',
            maleImage: personEntities[maleId]?.primaryImageUrl,
            femaleImage: personEntities[femaleId]?.primaryImageUrl,
            children: children
        };
    }
);
