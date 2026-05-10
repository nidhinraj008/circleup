import { FamilyMember } from '../../../../shared/types/family-member';

export interface FamilyMembersState {
    ids: number[];
    entities: { [key: number]: FamilyMember };
}

export const initialFamilyMembersState: FamilyMembersState = { ids: [], entities: {} };
