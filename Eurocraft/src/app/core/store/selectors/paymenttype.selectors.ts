import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromPaymentType from '../reducers/paymenttype.reducer';

export const getPaymentTypeState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.CoreState) => state.paymentTypeState
);

export const getPaymentTypeLoaded = createSelector(
    getPaymentTypeState,
    fromPaymentType.getPaymentTypeLoaded
);

export const getPaymentTypeLoading = createSelector(
    getPaymentTypeState,
    fromPaymentType.getPaymentTypeLoading
);

export const getCurrentPaymentTypeId = createSelector(
    getPaymentTypeState,
    state => state.currentPaymentTypeId
);

export const getCurrentPaymentType = createSelector(
    getPaymentTypeState,
    getCurrentPaymentTypeId,
    (state, currentPaymentTypeId) => {
        if (currentPaymentTypeId === 0) {
            return {
                PaymentTypeId: 0,
                PaymentTypeName: '',
            };
        } else {
            return currentPaymentTypeId ? state.paymentTypes.find(p => p.PaymentTypeId === currentPaymentTypeId) : null;
        }
    }
);

export const getPaymentTypes = createSelector(
    getPaymentTypeState,
    state => state.paymentTypes
);

export const getPaymentTypesAll = createSelector(
    getPaymentTypeState,
    state => state.paymentTypesAll
);

export const getPaymentTypeCount = createSelector(
    getPaymentTypeState,
    state => state.paymentTypeCount
);

export const getPaymentTypeDataSourceParameters = createSelector(
    getPaymentTypeState,
    state => state.paymentTypeDataSourceParameters
);

export const getPaymentTypeActionSucceeded = createSelector(
    getPaymentTypeState,
    fromPaymentType.getPaymentTypeActionSucceeded
);

export const getPaymentTypeError = createSelector(
    getPaymentTypeState,
    state => state.error
);
