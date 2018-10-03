import { ProductSubcategory } from "../../models/productsubcategory";
import { ProductSubcategoryActions, ProductSubcategoryActionTypes } from "../actions/productsubcategory.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface ProductSubcategoryState {
    loaded: boolean;
    loading: boolean;
    currentProductSubcategoryId: number | null;
    productSubcategories: ProductSubcategory[];
    productSubcategoriesAll: ProductSubcategory[];
    productSubcategoryCount: number;
    productSubcategoryDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: ProductSubcategoryState = {
    loaded: false,
    loading: false,
    currentProductSubcategoryId: null,
    productSubcategories: [],
    productSubcategoriesAll: [],
    productSubcategoryCount: 0,
    productSubcategoryDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: ProductSubcategoryActions): ProductSubcategoryState {

    switch (action.type) {
        case ProductSubcategoryActionTypes.SetCurrentProductSubcategory: {
            return {
                ...state,
                currentProductSubcategoryId: action.payload.ProductSubcategoryId,
                error: ''
            };
        }
        case ProductSubcategoryActionTypes.ClearCurrentProductSubcategory: {
            return {
                ...state,
                currentProductSubcategoryId: null,
                error: ''
            };
        }
        case ProductSubcategoryActionTypes.InitializeCurrentProductSubcategory: {
            return {
                ...state,
                currentProductSubcategoryId: 0,
                error: ''
            };
        }
        case ProductSubcategoryActionTypes.SetProductSubcategoryDataSourceParameters: {
            return {
                ...state,
                productSubcategoryDataSourceParameters: action.payload
            };
        }
        case ProductSubcategoryActionTypes.LoadProductSubcategory: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case ProductSubcategoryActionTypes.LoadProductSubcategorySuccess: {
            const productSubcategories = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                productSubcategories,
                productSubcategoryCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case ProductSubcategoryActionTypes.LoadProductSubcategoryFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                productSubcategories: [],
                productSubcategoryCount: 0,
                error: action.payload
            };
        }
        case ProductSubcategoryActionTypes.LoadProductSubcategoryAll: {
            return {
                ...state,
            };
        }
        case ProductSubcategoryActionTypes.LoadProductSubcategoryAllSuccess: {
            const productSubcategories = action.payload.value;
            return {
                ...state,
                productSubcategoriesAll: productSubcategories,
            };
        }
        case ProductSubcategoryActionTypes.LoadProductSubcategoryAllFail: {
            return {
                ...state,
                productSubcategoriesAll: [],
            };
        }
        case ProductSubcategoryActionTypes.CreateProductSubcategorySuccess: {
            const productSubcategory = action.payload;
            return {
                ...state,
                productSubcategories: [...state.productSubcategories, productSubcategory],
                currentProductSubcategoryId: productSubcategory.ProductSubcategoryId,
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductSubcategoryActionTypes.CreateProductSubcategoryFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case ProductSubcategoryActionTypes.UpdateProductSubcategorySuccess: {
            const productSubcategory = action.payload;
            const updatedProductSubcategories = state.productSubcategories.map(
                item => productSubcategory.ProductSubcategoryId === item.ProductSubcategoryId ? productSubcategory : item);

            return {
                ...state,
                productSubcategories: updatedProductSubcategories,
                currentProductSubcategoryId: productSubcategory.ProductSubcategoryId,
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductSubcategoryActionTypes.UpdateProductSubcategoryFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case ProductSubcategoryActionTypes.DeleteProductSubcategorySuccess: {
            return {
                ...state,
                productSubcategories: state.productSubcategories.filter(productSubcategory => productSubcategory.ProductSubcategoryId !== action.payload),
                currentProductSubcategoryId: null,
                productSubcategoryDataSourceParameters: new DataSourceParameters(
                    state.productSubcategoryDataSourceParameters.sortColumn,
                    state.productSubcategoryDataSourceParameters.sortDirection,
                    0,
                    state.productSubcategoryDataSourceParameters.pageSize,
                    state.productSubcategoryDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductSubcategoryActionTypes.DeleteProductSubcategoryFail: {
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

export const getProductSubcategoryLoaded = (state: ProductSubcategoryState) => state.loaded;
export const getProductSubcategoryLoading = (state: ProductSubcategoryState) => state.loading;
export const getCurrentProductSubcategoryId = (state: ProductSubcategoryState) => state.currentProductSubcategoryId;
export const getProductSubcategories = (state: ProductSubcategoryState) => state.productSubcategories;
export const getProductSubcategoriesAll = (state: ProductSubcategoryState) => state.productSubcategoriesAll;
export const getProductSubcategoryCount = (state: ProductSubcategoryState) => state.productSubcategoryCount;
export const getProductSubcategoryDataSourceParameters = (state: ProductSubcategoryState) => state.productSubcategoryDataSourceParameters;
export const getProductSubcategoryActionSucceeded = (state: ProductSubcategoryState) => state.actionSucceeded;
export const getProductSubcategoryError = (state: ProductSubcategoryState) => state.error;
