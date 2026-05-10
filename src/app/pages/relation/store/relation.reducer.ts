import { createReducer, on } from '@ngrx/store';
import { initialRelationsState } from './relation.state';
import * as RelationActions from './relation.actions';

export const relationReducer = createReducer(initialRelationsState,
  on(RelationActions.addRelation, (state, { relation }) => ({
    ...state,
    ids: [...state.ids, relation.id],
    entities: { ...state.entities, [relation.id]: relation }
  })),

  on(RelationActions.updateRelation, (state, { relation }) => ({
    ...state,
    entities: { ...state.entities, [relation.id]: relation }
  })),

  on(RelationActions.removeRelation, (state, { relationId }) => {
    const modifiedEntities = { ...state.entities };
    delete modifiedEntities[relationId]; 
    return {
      ...state,
      ids: state.ids.filter(id => id !== relationId),
      entities: modifiedEntities
    }
  }),

  on(RelationActions.clearRelations, state => ({
    ...state,
    ids: [],
    entities: {}
  }))
);