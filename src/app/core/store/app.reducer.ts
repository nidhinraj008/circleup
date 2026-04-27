import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { personsReducer } from '../features/persons';
import { authenticationReducer } from '../features/auth';
import { familyReducer } from '../features/family';
import { partnerReducer } from '../features/partner';

export const reducers: ActionReducerMap<AppState> = {
    persons: personsReducer,
    authentication: authenticationReducer,
    families: familyReducer,
    partners: partnerReducer,
};