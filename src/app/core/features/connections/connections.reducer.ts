import { createReducer, on } from '@ngrx/store';
import { initialConnectionsState } from './connections.state';
import * as ConnectionsActions from './connections.actions';

export const connectionsReducer = createReducer(initialConnectionsState,
  on(ConnectionsActions.addConnection, (state, { connection }) => ({
    ...state,
    ids: [...state.ids, connection.id],
    entities: { ...state.entities, [connection.id]: connection }
  })),

  on(ConnectionsActions.removeConnection, (state, { connectionId }) => {
    const modifiedEntities = { ...state.entities };
    delete modifiedEntities[connectionId]; 
    return {
      ...state,
      ids: state.ids.filter(id => id !== connectionId),
      entities: modifiedEntities
    }
  }),

  on(ConnectionsActions.clearConnections, state => ({
    ...state,
    ids: [],
    entities: {}
  }))
);