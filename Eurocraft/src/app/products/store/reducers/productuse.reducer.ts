import { ProductUse } from "../../models/productuse";
import { ProductUseActions, ProductUseActionUses } from "../actions/productuse.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface ProductUseState {
    loaded: boolean;
    loading: boolean;
    currentProductUseId: number | null;
    productUses: ProductUse[];
    productUsesAll: ProductUse[];
    productUseCount: number;
    productUseDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: ProductUseState = {
    loaded: false,
    loading: false,
    currentProductUseId: null,
    productUses: [],
    productUsesAll: [],
    productUseCount: 0,
    productUseDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: ProductUseActions): ProductUseState {

    switch (action.type) {
        case ProductUseActionUses.SetCurrentProductUse: {
            return {
                ...state,
                currentProductUseId: action.payload.ProductUseId,
                error: ''
            };
        }
        case ProductUseActionUses.ClearCurrentProductUse: {
            return {
                ...state,
                currentProductUseId: null,
                error: ''
            };
        }
        case ProductUseActionUses.InitializeCurrentProductUse: {
            return {
                ...state,
                currentProductUseId: 0,
                error: ''
            };
        }
        case ProductUseActionUses.SetProductUseDataSourceParameters: {
            return {
                ...state,
                productUseDataSourceParameters: action.payload
            };
        }
        case ProductUseActionUses.LoadProductUse: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case ProductUseActionUses.LoadProductUseSuccess: {
            const productUses = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                productUses,
                productUseCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case ProductUseActionUses.LoadProductUseFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                productUses: [],
                productUseCount: 0,
                error: action.payload
            };
        }
        case ProductUseActionUses.LoadProductUseAll: {
            return {
                ...state,
            };
        }
        case ProductUseActionUses.LoadProductUseAllSuccess: {
            const productUses = action.payload.value;
            return {
                ...state,
                productUsesAll: productUses,
            };
        }
        case ProductUseActionUses.LoadProductUseAllFail: {
            return {
                ...state,
                productUsesAll: [],
            };
        }
        case ProductUseActionUses.CreateProductUseSuccess: {
            const productUse = action.payload;
            return {
                ...state,
                productUses: [...state.productUses, productUse],
                currentProductUseId: productUse.ProductUseId,
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductUseActionUses.CreateProductUseFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case ProductUseActionUses.UpdateProductUseSuccess: {
            const productUse = action.payload;
            const updatedProductUses = state.productUses.map(
                item => productUse.ProductUseId === item.ProductUseId ? productUse : item);

            return {
                ...state,
                productUses: updatedProductUses,
                currentProductUseId: productUse.ProductUseId,
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductUseActionUses.UpdateProductUseFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case ProductUseActionUses.DeleteProductUseSuccess: {
            return {
                ...state,
                productUses: state.productUses.filter(productUse => productUse.ProductUseId !== action.payload),
                currentProductUseId: null,
                productUseDataSourceParameters: new DataSourceParameters(
                    state.productUseDataSourceParameters.sortColumn,
                    state.productUseDataSourceParameters.sortDirection,
                    0,
                    state.productUseDataSourceParameters.pageSize,
                    state.productUseDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductUseActionUses.DeleteProductUseFail: {
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

export const getProductUseLoaded = (state: ProductUseState) => state.loaded;
export const getProductUseLoading = (state: ProductUseState) => state.loading;
export const getCurrentProductUseId = (state: ProductUseState) => state.currentProductUseId;
export const getProductUses = (state: ProductUseState) => state.productUses;
export const getProductUsesAll = (state: ProductUseState) => state.productUsesAll;
export const getProductUseCount = (state: ProductUseState) => state.productUseCount;
export const getProductUseDataSourceParameters = (state: ProductUseState) => state.productUseDataSourceParameters;
export const getProductUseActionSucceeded = (state: ProductUseState) => state.actionSucceeded;
export const getProductUseError = (state: ProductUseState) => state.error;
