import { createReducer, on } from '@ngrx/store';
import { initialPersonsState } from './persons.state';
import * as PersonsActions from './persons.actions';

export const personsReducer = createReducer(initialPersonsState,
  on(PersonsActions.addPerson, (state, { person }) => ({
    ...state,
    ids: [...state.ids, person.id],
    entities: { ...state.entities, [person.id]: person }
  })),

  on(PersonsActions.updatePerson, (state, { person}) => ({
    ...state,
    entities: { ...state.entities, [person.id]: person }
  })),

  on(PersonsActions.removePerson, (state, { personId }) => {
    const modifiedEntities = { ...state.entities };
    delete modifiedEntities[personId]; 
    return {
      ...state,
      ids: state.ids.filter(id => id !== personId),
      entities: modifiedEntities
    }
  }),

  on(PersonsActions.clearPersons, state => ({
    ...state,
    ids: [],
    entities: {}
  }))
);
