import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { connectionsReducer } from '../features/connections';

export const reducers: ActionReducerMap<AppState> = { connections: connectionsReducer };