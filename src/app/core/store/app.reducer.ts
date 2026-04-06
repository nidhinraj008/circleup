import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { connectionsReducer } from '../features/connections';
import { authenticationReducer } from '../features/auth';

export const reducers: ActionReducerMap<AppState> = {
    connections: connectionsReducer,
    authentication: authenticationReducer
};