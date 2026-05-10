import { PersonsState } from '../../pages/person/store/persons.state';
import { AuthState } from './auth/auth.state';
import { FamilyState } from '../../pages/family/store';
import { RelationState } from '../../pages/relation/store';
import { FamilyMembersState } from '../../pages/family/store/family-members';

export interface AppState { 
    persons: PersonsState; 
    authentication: AuthState;
    families: FamilyState,
    relations: RelationState,
    familyMembers: FamilyMembersState,
}