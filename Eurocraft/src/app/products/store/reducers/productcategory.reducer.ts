import { ProductCategory } from "../../models/productcategory";
import { ProductCategoryActions, ProductCategoryActionTypes } from "../actions/productcategory.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface ProductCategoryState {
    loaded: boolean;
    loading: boolean;
    currentProductCategoryId: number | null;
    productCategories: ProductCategory[];
    productCategoriesAll: ProductCategory[];
    productCategoryCount: number;
    productCategoryDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: ProductCategoryState = {
    loaded: false,
    loading: false,
    currentProductCategoryId: null,
    productCategories: [],
    productCategoriesAll: [],
    productCategoryCount: 0,
    productCategoryDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: ProductCategoryActions): ProductCategoryState {

    switch (action.type) {
        case ProductCategoryActionTypes.SetCurrentProductCategory: {
            return {
                ...state,
                currentProductCategoryId: action.payload.ProductCategoryId,
                error: ''
            };
        }
        case ProductCategoryActionTypes.ClearCurrentProductCategory: {
            return {
                ...state,
                currentProductCategoryId: null,
                error: ''
            };
        }
        case ProductCategoryActionTypes.InitializeCurrentProductCategory: {
            return {
                ...state,
                currentProductCategoryId: 0,
                error: ''
            };
        }
        case ProductCategoryActionTypes.SetProductCategoryDataSourceParameters: {
            return {
                ...state,
                productCategoryDataSourceParameters: action.payload
            };
        }
        case ProductCategoryActionTypes.LoadProductCategory: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case ProductCategoryActionTypes.LoadProductCategorySuccess: {
            const productCategories = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                productCategories,
                productCategoryCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case ProductCategoryActionTypes.LoadProductCategoryFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                productCategories: [],
                productCategoryCount: 0,
                error: action.payload
            };
        }
        case ProductCategoryActionTypes.LoadProductCategoryAll: {
            return {
                ...state,
            };
        }
        case ProductCategoryActionTypes.LoadProductCategoryAllSuccess: {
            const productCategories = action.payload.value;
            return {
                ...state,
                productCategoriesAll: productCategories,
            };
        }
        case ProductCategoryActionTypes.LoadProductCategoryAllFail: {
            return {
                ...state,
                productCategoriesAll: [],
            };
        }
        case ProductCategoryActionTypes.CreateProductCategorySuccess: {
            const productCategory = action.payload;
            return {
                ...state,
                productCategories: [...state.productCategories, productCategory],
                currentProductCategoryId: productCategory.ProductCategoryId,
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductCategoryActionTypes.CreateProductCategoryFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case ProductCategoryActionTypes.UpdateProductCategorySuccess: {
            const productCategory = action.payload;
            const updatedProductCategories = state.productCategories.map(
                item => productCategory.ProductCategoryId === item.ProductCategoryId ? productCategory : item);

            return {
                ...state,
                productCategories: updatedProductCategories,
                currentProductCategoryId: productCategory.ProductCategoryId,
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductCategoryActionTypes.UpdateProductCategoryFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case ProductCategoryActionTypes.DeleteProductCategorySuccess: {
            return {
                ...state,
                productCategories: state.productCategories.filter(productCategory => productCategory.ProductCategoryId !== action.payload),
                currentProductCategoryId: null,
                productCategoryDataSourceParameters: new DataSourceParameters(
                    state.productCategoryDataSourceParameters.sortColumn,
                    state.productCategoryDataSourceParameters.sortDirection,
                    0,
                    state.productCategoryDataSourceParameters.pageSize,
                    state.productCategoryDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductCategoryActionTypes.DeleteProductCategoryFail: {
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

export const getProductCategoryLoaded = (state: ProductCategoryState) => state.loaded;
export const getProductCategoryLoading = (state: ProductCategoryState) => state.loading;
export const getCurrentProductCategoryId = (state: ProductCategoryState) => state.currentProductCategoryId;
export const getProductCategories = (state: ProductCategoryState) => state.productCategories;
export const getProductCategoriesAll = (state: ProductCategoryState) => state.productCategoriesAll;
export const getProductCategoryCount = (state: ProductCategoryState) => state.productCategoryCount;
export const getProductCategoryDataSourceParameters = (state: ProductCategoryState) => state.productCategoryDataSourceParameters;
export const getProductCategoryActionSucceeded = (state: ProductCategoryState) => state.actionSucceeded;
export const getProductCategoryError = (state: ProductCategoryState) => state.error;
