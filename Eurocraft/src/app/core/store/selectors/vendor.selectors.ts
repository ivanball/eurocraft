import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromVendor from '../reducers/vendor.reducer';
import { BusinessEntity } from "../../models/businessentity";

export const getVendorState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.CoreState) => state.vendorState
);

export const getVendorLoaded = createSelector(
    getVendorState,
    fromVendor.getVendorLoaded
);

export const getVendorLoading = createSelector(
    getVendorState,
    fromVendor.getVendorLoading
);

export const getCurrentVendorId = createSelector(
    getVendorState,
    state => state.currentVendorId
);

export const getCurrentVendor = createSelector(
    getVendorState,
    getCurrentVendorId,
    (state, currentVendorId) => {
        if (currentVendorId === 0) {
            return {
                BusinessEntityId: 0,
                VendorName: '',
                AccountNumber: '',
                Website: '',
                IsTaxExempt: 'N',
                PaymentTerms: '',
                PricingLevel: null,
                CreditAmount: null,
                BusinessEntity: new BusinessEntity(),
                PhoneNumber: null,
                AddressCity: null
                        };
        } else {
            return currentVendorId ? state.vendors.find(p => p.BusinessEntityId === currentVendorId) : null;
        }
    }
);

export const getVendors = createSelector(
    getVendorState,
    state => state.vendors
);

export const getVendorsAll = createSelector(
    getVendorState,
    state => state.vendorsAll
);

export const getVendorCount = createSelector(
    getVendorState,
    state => state.vendorCount
);

export const getVendorDataSourceParameters = createSelector(
    getVendorState,
    state => state.vendorDataSourceParameters
);

export const getVendorActionSucceeded = createSelector(
    getVendorState,
    fromVendor.getVendorActionSucceeded
);

export const getVendorError = createSelector(
    getVendorState,
    state => state.error
);
