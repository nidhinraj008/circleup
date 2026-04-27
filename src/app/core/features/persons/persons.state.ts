import { Person } from '../../../shared/types/person';

export interface PersonsState {
    ids: number[];
    entities: { [key: number]: Person };
}

export const initialPersonsState: PersonsState = { ids: [], entities: {} };


