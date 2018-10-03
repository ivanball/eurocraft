import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromProductUse from '../reducers/productuse.reducer';

export const getProductUseState = createSelector(
    fromFeature.getProductsState,
    (state: fromFeature.ProductsState) => state.productUseState
);

export const getProductUseLoaded = createSelector(
    getProductUseState,
    fromProductUse.getProductUseLoaded
);

export const getProductUseLoading = createSelector(
    getProductUseState,
    fromProductUse.getProductUseLoading
);

export const getCurrentProductUseId = createSelector(
    getProductUseState,
    state => state.currentProductUseId
);

export const getCurrentProductUse = createSelector(
    getProductUseState,
    getCurrentProductUseId,
    (state, currentProductUseId) => {
        if (currentProductUseId === 0) {
            return {
                ProductUseId: 0,
                ProductUseName: ''
            };
        } else {
            return currentProductUseId ? state.productUses.find(p => p.ProductUseId === currentProductUseId) : null;
        }
    }
);

export const getProductUses = createSelector(
    getProductUseState,
    state => state.productUses
);

export const getProductUsesAll = createSelector(
    getProductUseState,
    state => state.productUsesAll
);

export const getProductUseCount = createSelector(
    getProductUseState,
    state => state.productUseCount
);

export const getProductUseDataSourceParameters = createSelector(
    getProductUseState,
    state => state.productUseDataSourceParameters
);

export const getProductUseActionSucceeded = createSelector(
    getProductUseState,
    fromProductUse.getProductUseActionSucceeded
);

export const getProductUseError = createSelector(
    getProductUseState,
    state => state.error
);
