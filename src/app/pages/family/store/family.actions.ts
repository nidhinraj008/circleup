import { createAction, props } from '@ngrx/store';
import { Family } from '../../../shared/types/family';

export const addFamily = createAction('[Family] Add Family', props<{ family: Family }>());
export const updateFamily = createAction('[Family] Update Family', props<{ family: Family }>());
export const removeFamily = createAction('[Family] Remove Family', props<{ familyId: number }>());
export const clearFamilies = createAction('[Family] Clear Families');