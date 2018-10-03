import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromAddressType from '../reducers/addresstype.reducer';

export const getAddressTypeState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.CoreState) => state.addressTypeState
);

export const getAddressTypeLoaded = createSelector(
    getAddressTypeState,
    fromAddressType.getAddressTypeLoaded
);

export const getAddressTypeLoading = createSelector(
    getAddressTypeState,
    fromAddressType.getAddressTypeLoading
);

export const getCurrentAddressTypeId = createSelector(
    getAddressTypeState,
    state => state.currentAddressTypeId
);

export const getCurrentAddressType = createSelector(
    getAddressTypeState,
    getCurrentAddressTypeId,
    (state, currentAddressTypeId) => {
        if (currentAddressTypeId === 0) {
            return {
                AddressTypeId: 0,
                AddressTypeName: '',
            };
        } else {
            return currentAddressTypeId ? state.addressTypes.find(p => p.AddressTypeId === currentAddressTypeId) : null;
        }
    }
);

export const getAddressTypes = createSelector(
    getAddressTypeState,
    state => state.addressTypes
);

export const getAddressTypesAll = createSelector(
    getAddressTypeState,
    state => state.addressTypesAll
);

export const getAddressTypeCount = createSelector(
    getAddressTypeState,
    state => state.addressTypeCount
);

export const getAddressTypeDataSourceParameters = createSelector(
    getAddressTypeState,
    state => state.addressTypeDataSourceParameters
);

export const getAddressTypeActionSucceeded = createSelector(
    getAddressTypeState,
    fromAddressType.getAddressTypeActionSucceeded
);

export const getAddressTypeError = createSelector(
    getAddressTypeState,
    state => state.error
);
