import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromPhoneNumberType from '../reducers/phonenumbertype.reducer';

export const getPhoneNumberTypeState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.CoreState) => state.phoneNumberTypeState
);

export const getPhoneNumberTypeLoaded = createSelector(
    getPhoneNumberTypeState,
    fromPhoneNumberType.getPhoneNumberTypeLoaded
);

export const getPhoneNumberTypeLoading = createSelector(
    getPhoneNumberTypeState,
    fromPhoneNumberType.getPhoneNumberTypeLoading
);

export const getCurrentPhoneNumberTypeId = createSelector(
    getPhoneNumberTypeState,
    state => state.currentPhoneNumberTypeId
);

export const getCurrentPhoneNumberType = createSelector(
    getPhoneNumberTypeState,
    getCurrentPhoneNumberTypeId,
    (state, currentPhoneNumberTypeId) => {
        if (currentPhoneNumberTypeId === 0) {
            return {
                PhoneNumberTypeId: 0,
                PhoneNumberTypeName: '',
            };
        } else {
            return currentPhoneNumberTypeId ? state.phoneNumberTypes.find(p => p.PhoneNumberTypeId === currentPhoneNumberTypeId) : null;
        }
    }
);

export const getPhoneNumberTypes = createSelector(
    getPhoneNumberTypeState,
    state => state.phoneNumberTypes
);

export const getPhoneNumberTypesAll = createSelector(
    getPhoneNumberTypeState,
    state => state.phoneNumberTypesAll
);

export const getPhoneNumberTypeCount = createSelector(
    getPhoneNumberTypeState,
    state => state.phoneNumberTypeCount
);

export const getPhoneNumberTypeDataSourceParameters = createSelector(
    getPhoneNumberTypeState,
    state => state.phoneNumberTypeDataSourceParameters
);

export const getPhoneNumberTypeActionSucceeded = createSelector(
    getPhoneNumberTypeState,
    fromPhoneNumberType.getPhoneNumberTypeActionSucceeded
);

export const getPhoneNumberTypeError = createSelector(
    getPhoneNumberTypeState,
    state => state.error
);
