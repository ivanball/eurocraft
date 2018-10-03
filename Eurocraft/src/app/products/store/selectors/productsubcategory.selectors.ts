import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromProductSubcategory from '../reducers/productsubcategory.reducer';

export const getProductSubcategoryState = createSelector(
    fromFeature.getProductsState,
    (state: fromFeature.ProductsState) => state.productSubcategoryState
);

export const getProductSubcategoryLoaded = createSelector(
    getProductSubcategoryState,
    fromProductSubcategory.getProductSubcategoryLoaded
);

export const getProductSubcategoryLoading = createSelector(
    getProductSubcategoryState,
    fromProductSubcategory.getProductSubcategoryLoading
);

export const getCurrentProductSubcategoryId = createSelector(
    getProductSubcategoryState,
    state => state.currentProductSubcategoryId
);

export const getCurrentProductSubcategory = createSelector(
    getProductSubcategoryState,
    getCurrentProductSubcategoryId,
    (state, currentProductSubcategoryId) => {
        if (currentProductSubcategoryId === 0) {
            return {
                ProductSubcategoryId: 0,
                ProductSubcategoryName: '',
                ProductCategoryId: null
            };
        } else {
            return currentProductSubcategoryId ? state.productSubcategories.find(p => p.ProductSubcategoryId === currentProductSubcategoryId) : null;
        }
    }
);

export const getProductSubcategories = createSelector(
    getProductSubcategoryState,
    state => state.productSubcategories
);

export const getProductSubcategoriesAll = createSelector(
    getProductSubcategoryState,
    state => state.productSubcategoriesAll
);

export const getProductSubcategoryCount = createSelector(
    getProductSubcategoryState,
    state => state.productSubcategoryCount
);

export const getProductSubcategoryDataSourceParameters = createSelector(
    getProductSubcategoryState,
    state => state.productSubcategoryDataSourceParameters
);

export const getProductSubcategoryActionSucceeded = createSelector(
    getProductSubcategoryState,
    fromProductSubcategory.getProductSubcategoryActionSucceeded
);

export const getProductSubcategoryError = createSelector(
    getProductSubcategoryState,
    state => state.error
);
