import { Connection } from '../../../shared/types/connections';

export interface ConnectionsState {
    ids: number[];
    entities: { [key: number]: Connection };
}

export const initialConnectionsState: ConnectionsState = { ids: [], entities: {} };


