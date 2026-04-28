import { PersonsState } from '../features/persons/persons.state';
import { AuthState } from '../features/auth/auth.state';
import { FamilyState } from '../features/family';
import { PartnerState } from '../features/partner';
import { FamilyMembersState } from '../features/family-members';

export interface AppState { 
    persons: PersonsState; 
    authentication: AuthState;
    families: FamilyState,
    partners: PartnerState,
    familyMembers: FamilyMembersState,
}