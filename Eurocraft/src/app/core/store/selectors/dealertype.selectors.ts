import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromDealerType from '../reducers/dealertype.reducer';

export const getDealerTypeState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.CoreState) => state.dealerTypeState
);

export const getDealerTypeLoaded = createSelector(
    getDealerTypeState,
    fromDealerType.getDealerTypeLoaded
);

export const getDealerTypeLoading = createSelector(
    getDealerTypeState,
    fromDealerType.getDealerTypeLoading
);

export const getCurrentDealerTypeId = createSelector(
    getDealerTypeState,
    state => state.currentDealerTypeId
);

export const getCurrentDealerType = createSelector(
    getDealerTypeState,
    getCurrentDealerTypeId,
    (state, currentDealerTypeId) => {
        if (currentDealerTypeId === 0) {
            return {
                DealerTypeId: 0,
                DealerTypeName: '',
            };
        } else {
            return currentDealerTypeId ? state.dealerTypes.find(p => p.DealerTypeId === currentDealerTypeId) : null;
        }
    }
);

export const getDealerTypes = createSelector(
    getDealerTypeState,
    state => state.dealerTypes
);

export const getDealerTypesAll = createSelector(
    getDealerTypeState,
    state => state.dealerTypesAll
);

export const getDealerTypeCount = createSelector(
    getDealerTypeState,
    state => state.dealerTypeCount
);

export const getDealerTypeDataSourceParameters = createSelector(
    getDealerTypeState,
    state => state.dealerTypeDataSourceParameters
);

export const getDealerTypeActionSucceeded = createSelector(
    getDealerTypeState,
    fromDealerType.getDealerTypeActionSucceeded
);

export const getDealerTypeError = createSelector(
    getDealerTypeState,
    state => state.error
);
