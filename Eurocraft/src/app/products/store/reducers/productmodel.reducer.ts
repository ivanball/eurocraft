import { ProductModel } from "../../models/productmodel";
import { ProductModelActions, ProductModelActionTypes } from "../actions/productmodel.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface ProductModelState {
    loaded: boolean;
    loading: boolean;
    currentProductModelId: number | null;
    productModels: ProductModel[];
    productModelsAll: ProductModel[];
    productModelCount: number;
    productModelDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: ProductModelState = {
    loaded: false,
    loading: false,
    currentProductModelId: null,
    productModels: [],
    productModelsAll: [],
    productModelCount: 0,
    productModelDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: ProductModelActions): ProductModelState {

    switch (action.type) {
        case ProductModelActionTypes.SetCurrentProductModel: {
            return {
                ...state,
                currentProductModelId: action.payload.ProductModelId,
                error: ''
            };
        }
        case ProductModelActionTypes.ClearCurrentProductModel: {
            return {
                ...state,
                currentProductModelId: null,
                error: ''
            };
        }
        case ProductModelActionTypes.InitializeCurrentProductModel: {
            return {
                ...state,
                currentProductModelId: 0,
                error: ''
            };
        }
        case ProductModelActionTypes.SetProductModelDataSourceParameters: {
            return {
                ...state,
                productModelDataSourceParameters: action.payload
            };
        }
        case ProductModelActionTypes.LoadProductModel: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case ProductModelActionTypes.LoadProductModelSuccess: {
            const productModels = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                productModels,
                productModelCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case ProductModelActionTypes.LoadProductModelFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                productModels: [],
                productModelCount: 0,
                error: action.payload
            };
        }
        case ProductModelActionTypes.LoadProductModelAll: {
            return {
                ...state,
            };
        }
        case ProductModelActionTypes.LoadProductModelAllSuccess: {
            const productModels = action.payload.value;
            return {
                ...state,
                productModelsAll: productModels,
            };
        }
        case ProductModelActionTypes.LoadProductModelAllFail: {
            return {
                ...state,
                productModelsAll: [],
            };
        }
        case ProductModelActionTypes.CreateProductModelSuccess: {
            const productModel = action.payload;
            return {
                ...state,
                productModels: [...state.productModels, productModel],
                currentProductModelId: productModel.ProductModelId,
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductModelActionTypes.CreateProductModelFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case ProductModelActionTypes.UpdateProductModelSuccess: {
            const productModel = action.payload;
            const updatedProductModels = state.productModels.map(
                item => productModel.ProductModelId === item.ProductModelId ? productModel : item);

            return {
                ...state,
                productModels: updatedProductModels,
                currentProductModelId: productModel.ProductModelId,
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductModelActionTypes.UpdateProductModelFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case ProductModelActionTypes.DeleteProductModelSuccess: {
            return {
                ...state,
                productModels: state.productModels.filter(productModel => productModel.ProductModelId !== action.payload),
                currentProductModelId: null,
                productModelDataSourceParameters: new DataSourceParameters(
                    state.productModelDataSourceParameters.sortColumn,
                    state.productModelDataSourceParameters.sortDirection,
                    0,
                    state.productModelDataSourceParameters.pageSize,
                    state.productModelDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductModelActionTypes.DeleteProductModelFail: {
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

export const getProductModelLoaded = (state: ProductModelState) => state.loaded;
export const getProductModelLoading = (state: ProductModelState) => state.loading;
export const getCurrentProductModelId = (state: ProductModelState) => state.currentProductModelId;
export const getProductModels = (state: ProductModelState) => state.productModels;
export const getProductModelsAll = (state: ProductModelState) => state.productModelsAll;
export const getProductModelCount = (state: ProductModelState) => state.productModelCount;
export const getProductModelDataSourceParameters = (state: ProductModelState) => state.productModelDataSourceParameters;
export const getProductModelActionSucceeded = (state: ProductModelState) => state.actionSucceeded;
export const getProductModelError = (state: ProductModelState) => state.error;
