import { createAction, props } from '@ngrx/store';
import { Person } from '../../../shared/types/person';

export const addPerson = createAction('[Persons] Add Person', props<{ person: Person }>());
export const updatePerson = createAction('[Persons] Update Person', props<{ person: Person }>());
export const removePerson = createAction('[Persons] Remove Person', props<{ personId: number }>());
export const clearPersons = createAction('[Persons] Clear Persons');
