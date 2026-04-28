import { createSelector } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { FamilyMembersState } from './family-members.state';

export const selectFamilyMembersState = (state: AppState) => state.familyMembers;

export const selectAllFamilyMembers = createSelector(
    selectFamilyMembersState,
    (state: FamilyMembersState) => state.ids.map(id => state.entities[id])
);

export const selectFamilyMembersByFamilyId = (familyId: number) => createSelector(
    selectAllFamilyMembers,
    (familyMembers) => familyMembers.filter(member => member.familyId === familyId)
);

export const selectFamilyMembersByPersonId = (personId: number) => createSelector(
    selectAllFamilyMembers,
    (familyMembers) => familyMembers.filter(member => member.personId === personId)
);

export const selectLargestFamilyMemberId = createSelector(
    selectAllFamilyMembers,
    (familyMembers) => {
        if (familyMembers.length === 0) return 0;
        return Math.max(...familyMembers.map(fm => fm.id));
    }
);
