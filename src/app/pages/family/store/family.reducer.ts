import { createReducer, on } from '@ngrx/store';
import { initialFamilyState } from './family.state';
import * as FamilyActions from './family.actions';

export const familyReducer = createReducer(initialFamilyState,
  on(FamilyActions.addFamily, (state, { family }) => ({
    ...state,
    ids: [...state.ids, family.id],
    entities: { ...state.entities, [family.id]: family }
  })),

  on(FamilyActions.updateFamily, (state, { family }) => ({
    ...state,
    entities: { ...state.entities, [family.id]: family }
  })),

  on(FamilyActions.removeFamily, (state, { familyId }) => {
    const modifiedEntities = { ...state.entities };
    delete modifiedEntities[familyId];
    return {
      ...state,
      ids: state.ids.filter(id => id !== familyId),
      entities: modifiedEntities
    }
  }),

  on(FamilyActions.clearFamilies, state => ({
    ...state,
    ids: [],
    entities: {}
  }))
);