import { Family } from '../../types/family';

export interface FamilyState {
    ids: number[];
    entities: { [key: number]: Family };
}

export const initialConnectionsState: FamilyState = { ids: [], entities: {} };


