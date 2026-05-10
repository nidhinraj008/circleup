import { createAction, props } from '@ngrx/store';
import { Relation } from '../../../shared/types/relation';

export const addRelation = createAction('[Relation] Add Relation', props<{ relation: Relation }>());
export const updateRelation = createAction('[Relation] Update Relation', props<{ relation: Relation }>());
export const removeRelation = createAction('[Relation] Remove Relation', props<{ relationId: number }>());
export const clearRelations = createAction('[Relation] Clear Relations');