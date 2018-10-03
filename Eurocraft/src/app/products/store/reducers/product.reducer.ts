import { Product } from "../../models/product";
import { ProductActions, ProductActionTypes } from "../actions/product.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface ProductState {
    loaded: boolean;
    loading: boolean;
    currentProductId: number | null;
    products: Product[];
    productsAll: Product[];
    productCount: number;
    productDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: ProductState = {
    loaded: false,
    loading: false,
    currentProductId: null,
    products: [],
    productsAll: [],
    productCount: 0,
    productDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: ProductActions): ProductState {

    switch (action.type) {
        case ProductActionTypes.SetCurrentProduct: {
            return {
                ...state,
                currentProductId: action.payload.ProductId,
                error: ''
            };
        }
        case ProductActionTypes.ClearCurrentProduct: {
            return {
                ...state,
                currentProductId: null,
                error: ''
            };
        }
        case ProductActionTypes.InitializeCurrentProduct: {
            return {
                ...state,
                currentProductId: 0,
                error: ''
            };
        }
        case ProductActionTypes.SetProductDataSourceParameters: {
            return {
                ...state,
                productDataSourceParameters: action.payload
            };
        }
        case ProductActionTypes.LoadProduct: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case ProductActionTypes.LoadProductSuccess: {
            const products = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                products,
                productCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case ProductActionTypes.LoadProductFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                products: [],
                productCount: 0,
                error: action.payload
            };
        }
        case ProductActionTypes.LoadProductAll: {
            return {
                ...state,
            };
        }
        case ProductActionTypes.LoadProductAllSuccess: {
            const products = action.payload.value;
            return {
                ...state,
                productsAll: products,
            };
        }
        case ProductActionTypes.LoadProductAllFail: {
            return {
                ...state,
                productsAll: [],
            };
        }
        case ProductActionTypes.CreateProductSuccess: {
            const product = action.payload;
            return {
                ...state,
                products: [...state.products, product],
                currentProductId: product.ProductId,
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductActionTypes.CreateProductFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case ProductActionTypes.UpdateProductSuccess: {
            const product = action.payload;
            const updatedProducts = state.products.map(
                item => product.ProductId === item.ProductId ? product : item);

            return {
                ...state,
                products: updatedProducts,
                currentProductId: product.ProductId,
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductActionTypes.UpdateProductFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case ProductActionTypes.DeleteProductSuccess: {
            return {
                ...state,
                products: state.products.filter(product => product.ProductId !== action.payload),
                currentProductId: null,
                productDataSourceParameters: new DataSourceParameters(
                    state.productDataSourceParameters.sortColumn,
                    state.productDataSourceParameters.sortDirection,
                    0,
                    state.productDataSourceParameters.pageSize,
                    state.productDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductActionTypes.DeleteProductFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        default: {
            return state;
        }
    }
}

export const getProductLoaded = (state: ProductState) => state.loaded;
export const getProductLoading = (state: ProductState) => state.loading;
export const getCurrentProductId = (state: ProductState) => state.currentProductId;
export const getProducts = (state: ProductState) => state.products;
export const getProductsAll = (state: ProductState) => state.productsAll;
export const getProductCount = (state: ProductState) => state.productCount;
export const getProductDataSourceParameters = (state: ProductState) => state.productDataSourceParameters;
export const getProductActionSucceeded = (state: ProductState) => state.actionSucceeded;
export const getProductError = (state: ProductState) => state.error;
