import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { connectionsReducer } from '../features/connections';
import { authenticationReducer } from '../features/auth';
import { familyReducer } from '../features/family';
import { partnerReducer } from '../features/partner';

export const reducers: ActionReducerMap<AppState> = {
    connections: connectionsReducer,
    authentication: authenticationReducer,
    families: familyReducer,
    partners: partnerReducer,
};