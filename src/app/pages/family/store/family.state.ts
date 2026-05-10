import { Family } from '../../../shared/types/family';

export interface FamilyState {
    ids: number[];
    entities: { [key: number]: Family };
}

export const initialFamilyState: FamilyState = { ids: [], entities: {} };


