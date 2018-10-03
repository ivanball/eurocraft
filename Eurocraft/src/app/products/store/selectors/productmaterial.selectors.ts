import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromProductMaterial from '../reducers/productmaterial.reducer';

export const getProductMaterialState = createSelector(
    fromFeature.getProductsState,
    (state: fromFeature.ProductsState) => state.productMaterialState
);

export const getProductMaterialLoaded = createSelector(
    getProductMaterialState,
    fromProductMaterial.getProductMaterialLoaded
);

export const getProductMaterialLoading = createSelector(
    getProductMaterialState,
    fromProductMaterial.getProductMaterialLoading
);

export const getCurrentProductMaterialId = createSelector(
    getProductMaterialState,
    state => state.currentProductMaterialId
);

export const getCurrentProductMaterial = createSelector(
    getProductMaterialState,
    getCurrentProductMaterialId,
    (state, currentProductMaterialId) => {
        if (currentProductMaterialId === 0) {
            return {
                ProductMaterialId: 0,
                ProductMaterialName: ''
            };
        } else {
            return currentProductMaterialId ? state.productMaterials.find(p => p.ProductMaterialId === currentProductMaterialId) : null;
        }
    }
);

export const getProductMaterials = createSelector(
    getProductMaterialState,
    state => state.productMaterials
);

export const getProductMaterialsAll = createSelector(
    getProductMaterialState,
    state => state.productMaterialsAll
);

export const getProductMaterialCount = createSelector(
    getProductMaterialState,
    state => state.productMaterialCount
);

export const getProductMaterialDataSourceParameters = createSelector(
    getProductMaterialState,
    state => state.productMaterialDataSourceParameters
);

export const getProductMaterialActionSucceeded = createSelector(
    getProductMaterialState,
    fromProductMaterial.getProductMaterialActionSucceeded
);

export const getProductMaterialError = createSelector(
    getProductMaterialState,
    state => state.error
);
