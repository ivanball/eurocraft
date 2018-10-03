import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromProduct from '../reducers/product.reducer';

export const getProductState = createSelector(
    fromFeature.getProductsState,
    (state: fromFeature.ProductsState) => state.productState
);

export const getProductLoaded = createSelector(
    getProductState,
    fromProduct.getProductLoaded
);

export const getProductLoading = createSelector(
    getProductState,
    fromProduct.getProductLoading
);

export const getCurrentProductId = createSelector(
    getProductState,
    state => state.currentProductId
);

export const getCurrentProduct = createSelector(
    getProductState,
    getCurrentProductId,
    (state, currentProductId) => {
        if (currentProductId === 0) {
            return {
                ProductId: 0,
                ProductName: '',
                ProductNumber: '',
                ProductCategoryId: null,
                ProductCategoryName: null,
                ProductSubcategoryId: null,
                ProductSubcategoryName: null,
                SEMFormula: ''
            };
        } else {
            return currentProductId ? state.products.find(p => p.ProductId === currentProductId) : null;
        }
    }
);

export const getProducts = createSelector(
    getProductState,
    state => state.products
);

export const getProductsAll = createSelector(
    getProductState,
    state => state.productsAll
);

export const getProductCount = createSelector(
    getProductState,
    state => state.productCount
);

export const getProductDataSourceParameters = createSelector(
    getProductState,
    state => state.productDataSourceParameters
);

export const getProductActionSucceeded = createSelector(
    getProductState,
    fromProduct.getProductActionSucceeded
);

export const getProductError = createSelector(
    getProductState,
    state => state.error
);
