import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromProductType from '../reducers/producttype.reducer';

export const getProductTypeState = createSelector(
    fromFeature.getProductsState,
    (state: fromFeature.ProductsState) => state.productTypeState
);

export const getProductTypeLoaded = createSelector(
    getProductTypeState,
    fromProductType.getProductTypeLoaded
);

export const getProductTypeLoading = createSelector(
    getProductTypeState,
    fromProductType.getProductTypeLoading
);

export const getCurrentProductTypeId = createSelector(
    getProductTypeState,
    state => state.currentProductTypeId
);

export const getCurrentProductType = createSelector(
    getProductTypeState,
    getCurrentProductTypeId,
    (state, currentProductTypeId) => {
        if (currentProductTypeId === 0) {
            return {
                ProductTypeId: 0,
                ProductTypeName: ''
            };
        } else {
            return currentProductTypeId ? state.productTypes.find(p => p.ProductTypeId === currentProductTypeId) : null;
        }
    }
);

export const getProductTypes = createSelector(
    getProductTypeState,
    state => state.productTypes
);

export const getProductTypesAll = createSelector(
    getProductTypeState,
    state => state.productTypesAll
);

export const getProductTypeCount = createSelector(
    getProductTypeState,
    state => state.productTypeCount
);

export const getProductTypeDataSourceParameters = createSelector(
    getProductTypeState,
    state => state.productTypeDataSourceParameters
);

export const getProductTypeActionSucceeded = createSelector(
    getProductTypeState,
    fromProductType.getProductTypeActionSucceeded
);

export const getProductTypeError = createSelector(
    getProductTypeState,
    state => state.error
);
