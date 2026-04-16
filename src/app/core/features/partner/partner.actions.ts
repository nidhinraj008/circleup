import { createAction, props } from '@ngrx/store';
import { Partner } from '../../../shared/types/partner';

export const addPartner = createAction('[Partner] Add Partner', props<{ partner: Partner }>());
export const updatePartner = createAction('[Partner] Update Partner', props<{ partner: Partner }>());
export const removePartner = createAction('[Partner] Remove Partner', props<{ partnerId: number }>());
export const clearPartners = createAction('[Partner] Clear Partners');