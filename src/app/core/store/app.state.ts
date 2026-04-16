import { ConnectionsState } from '../features/connections/connections.state';
import { AuthState } from '../features/auth/auth.state';
import { FamilyState } from '../features/family';
import { PartnerState } from '../features/partner';

export interface AppState { 
    connections: ConnectionsState; 
    authentication: AuthState;
    families: FamilyState,
    partners: PartnerState,
}