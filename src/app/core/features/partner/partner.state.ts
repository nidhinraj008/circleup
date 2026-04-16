import { Partner } from '../../../shared/types/partner';

export interface PartnerState {
    ids: number[];
    entities: { [key: number]: Partner };
}

export const initialConnectionsState: PartnerState = { ids: [], entities: {} };


