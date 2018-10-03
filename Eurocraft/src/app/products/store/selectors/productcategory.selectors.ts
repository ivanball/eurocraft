import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromProductCategory from '../reducers/productcategory.reducer';

export const getProductCategoryState = createSelector(
    fromFeature.getProductsState,
    (state: fromFeature.ProductsState) => state.productCategoryState
);

export const getProductCategoryLoaded = createSelector(
    getProductCategoryState,
    fromProductCategory.getProductCategoryLoaded
);

export const getProductCategoryLoading = createSelector(
    getProductCategoryState,
    fromProductCategory.getProductCategoryLoading
);

export const getCurrentProductCategoryId = createSelector(
    getProductCategoryState,
    state => state.currentProductCategoryId
);

export const getCurrentProductCategory = createSelector(
    getProductCategoryState,
    getCurrentProductCategoryId,
    (state, currentProductCategoryId) => {
        if (currentProductCategoryId === 0) {
            return {
                ProductCategoryId: 0,
                ProductCategoryName: '',
                ProductMaterialId: null,
                ProductMaterialName: null,
                ProductModelId: null,
                ProductModelName: null,
                ProductTypeId: null,
                ProductTypeName: null,
                ProductUseId: null,
                ProductUseName: null
            };
        } else {
            return currentProductCategoryId ? state.productCategories.find(p => p.ProductCategoryId === currentProductCategoryId) : null;
        }
    }
);

export const getProductCategories = createSelector(
    getProductCategoryState,
    state => state.productCategories
);

export const getProductCategoriesAll = createSelector(
    getProductCategoryState,
    state => state.productCategoriesAll
);

export const getProductCategoryCount = createSelector(
    getProductCategoryState,
    state => state.productCategoryCount
);

export const getProductCategoryDataSourceParameters = createSelector(
    getProductCategoryState,
    state => state.productCategoryDataSourceParameters
);

export const getProductCategoryActionSucceeded = createSelector(
    getProductCategoryState,
    fromProductCategory.getProductCategoryActionSucceeded
);

export const getProductCategoryError = createSelector(
    getProductCategoryState,
    state => state.error
);
