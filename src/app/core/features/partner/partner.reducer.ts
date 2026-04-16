import { createReducer, on } from '@ngrx/store';
import { initialConnectionsState } from './partner.state';
import * as PartnerActions from './partner.actions';

export const partnerReducer = createReducer(initialConnectionsState,
  on(PartnerActions.addPartner, (state, { partner }) => ({
    ...state,
    ids: [...state.ids, partner.id],
    entities: { ...state.entities, [partner.id]: partner }
  })),

  on(PartnerActions.updatePartner, (state, { partner}) => ({
    ...state,
    entities: { ...state.entities, [partner.id]: partner }
  })),

  on(PartnerActions.removePartner, (state, { partnerId }) => {
    const modifiedEntities = { ...state.entities };
    delete modifiedEntities[partnerId]; 
    return {
      ...state,
      ids: state.ids.filter(id => id !== partnerId),
      entities: modifiedEntities
    }
  }),

  on(PartnerActions.clearPartners, state => ({
    ...state,
    ids: [],
    entities: {}
  }))
);