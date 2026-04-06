import { ConnectionsState } from '../features/connections/connections.state';
import { AuthState } from '../features/auth/auth.state';

export interface AppState { 
    connections: ConnectionsState; 
    authentication: AuthState;
}