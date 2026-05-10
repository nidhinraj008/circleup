import { Relation } from '../../../shared/types/relation';

export interface RelationState {
    ids: number[];
    entities: { [key: number]: Relation };
}

export const initialRelationsState: RelationState = { ids: [], entities: {} };
