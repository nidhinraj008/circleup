import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { personsReducer } from '../../pages/person/store';
import { authenticationReducer } from './auth';
import { familyReducer } from '../../pages/family/store';
import { relationReducer } from '../../pages/relation/store';
import { familyMembersReducer } from '../../pages/family/store/family-members';

export const reducers: ActionReducerMap<AppState> = {
    persons: personsReducer,
    authentication: authenticationReducer,
    families: familyReducer,
    relations: relationReducer,
    familyMembers: familyMembersReducer,
};