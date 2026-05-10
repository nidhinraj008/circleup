import { createReducer, on } from '@ngrx/store';
import { initialFamilyMembersState } from './family-members.state';
import * as FamilyMembersActions from './family-members.actions';

export const familyMembersReducer = createReducer(initialFamilyMembersState,
  on(FamilyMembersActions.addFamilyMember, (state, { familyMember }) => ({
    ...state,
    ids: [...state.ids, familyMember.id],
    entities: { ...state.entities, [familyMember.id]: familyMember }
  })),

  on(FamilyMembersActions.removeFamilyMember, (state, { id }) => {
    const modifiedEntities = { ...state.entities };
    delete modifiedEntities[id];
    return {
      ...state,
      ids: state.ids.filter(i => i !== id),
      entities: modifiedEntities
    };
  }),

  on(FamilyMembersActions.removeFamilyMembersByFamilyId, (state, { familyId }) => {
    const idsToRemove = state.ids.filter(id => state.entities[id].familyId === familyId);
    const modifiedEntities = { ...state.entities };
    idsToRemove.forEach(id => delete modifiedEntities[id]);
    return {
      ...state,
      ids: state.ids.filter(id => !idsToRemove.includes(id)),
      entities: modifiedEntities
    };
  }),

  on(FamilyMembersActions.removeFamilyMembersByPersonId, (state, { personId }) => {
    const idsToRemove = state.ids.filter(id => state.entities[id].personId === personId);
    const modifiedEntities = { ...state.entities };
    idsToRemove.forEach(id => delete modifiedEntities[id]);
    return {
      ...state,
      ids: state.ids.filter(id => !idsToRemove.includes(id)),
      entities: modifiedEntities
    };
  }),

  on(FamilyMembersActions.clearFamilyMembers, state => ({
    ...state,
    ids: [],
    entities: {}
  }))
);
