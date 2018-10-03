import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromProductModel from '../reducers/productmodel.reducer';

export const getProductModelState = createSelector(
    fromFeature.getProductsState,
    (state: fromFeature.ProductsState) => state.productModelState
);

export const getProductModelLoaded = createSelector(
    getProductModelState,
    fromProductModel.getProductModelLoaded
);

export const getProductModelLoading = createSelector(
    getProductModelState,
    fromProductModel.getProductModelLoading
);

export const getCurrentProductModelId = createSelector(
    getProductModelState,
    state => state.currentProductModelId
);

export const getCurrentProductModel = createSelector(
    getProductModelState,
    getCurrentProductModelId,
    (state, currentProductModelId) => {
        if (currentProductModelId === 0) {
            return {
                ProductModelId: 0,
                ProductModelName: ''
            };
        } else {
            return currentProductModelId ? state.productModels.find(p => p.ProductModelId === currentProductModelId) : null;
        }
    }
);

export const getProductModels = createSelector(
    getProductModelState,
    state => state.productModels
);

export const getProductModelsAll = createSelector(
    getProductModelState,
    state => state.productModelsAll
);

export const getProductModelCount = createSelector(
    getProductModelState,
    state => state.productModelCount
);

export const getProductModelDataSourceParameters = createSelector(
    getProductModelState,
    state => state.productModelDataSourceParameters
);

export const getProductModelActionSucceeded = createSelector(
    getProductModelState,
    fromProductModel.getProductModelActionSucceeded
);

export const getProductModelError = createSelector(
    getProductModelState,
    state => state.error
);
