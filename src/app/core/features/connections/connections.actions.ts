import { createAction, props } from '@ngrx/store';
import { Connection } from '../../types/connections';

export const addConnection = createAction('[Connections] Add Connection', props<{ connection: Connection }>());
export const removeConnection = createAction('[Connections] Remove Connection', props<{ connectionId: number }>());
export const clearConnections = createAction('[Connections] Clear Connections');