import { createAction, props } from '@ngrx/store';
import { FamilyMember } from '../../../../shared/types/family-member';

export const addFamilyMember = createAction('[Family Member] Add Family Member', props<{ familyMember: FamilyMember }>());
export const removeFamilyMember = createAction('[Family Member] Remove Family Member', props<{ id: number }>());
export const removeFamilyMembersByFamilyId = createAction('[Family Member] Remove Family Members By Family Id', props<{ familyId: number }>());
export const removeFamilyMembersByPersonId = createAction('[Family Member] Remove Family Members By Person Id', props<{ personId: number }>());
export const clearFamilyMembers = createAction('[Family Member] Clear Family Members');
