import { ProductType } from "../../models/producttype";
import { ProductTypeActions, ProductTypeActionTypes } from "../actions/producttype.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface ProductTypeState {
    loaded: boolean;
    loading: boolean;
    currentProductTypeId: number | null;
    productTypes: ProductType[];
    productTypesAll: ProductType[];
    productTypeCount: number;
    productTypeDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: ProductTypeState = {
    loaded: false,
    loading: false,
    currentProductTypeId: null,
    productTypes: [],
    productTypesAll: [],
    productTypeCount: 0,
    productTypeDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: ProductTypeActions): ProductTypeState {

    switch (action.type) {
        case ProductTypeActionTypes.SetCurrentProductType: {
            return {
                ...state,
                currentProductTypeId: action.payload.ProductTypeId,
                error: ''
            };
        }
        case ProductTypeActionTypes.ClearCurrentProductType: {
            return {
                ...state,
                currentProductTypeId: null,
                error: ''
            };
        }
        case ProductTypeActionTypes.InitializeCurrentProductType: {
            return {
                ...state,
                currentProductTypeId: 0,
                error: ''
            };
        }
        case ProductTypeActionTypes.SetProductTypeDataSourceParameters: {
            return {
                ...state,
                productTypeDataSourceParameters: action.payload
            };
        }
        case ProductTypeActionTypes.LoadProductType: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case ProductTypeActionTypes.LoadProductTypeSuccess: {
            const productTypes = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                productTypes,
                productTypeCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case ProductTypeActionTypes.LoadProductTypeFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                productTypes: [],
                productTypeCount: 0,
                error: action.payload
            };
        }
        case ProductTypeActionTypes.LoadProductTypeAll: {
            return {
                ...state,
            };
        }
        case ProductTypeActionTypes.LoadProductTypeAllSuccess: {
            const productTypes = action.payload.value;
            return {
                ...state,
                productTypesAll: productTypes,
            };
        }
        case ProductTypeActionTypes.LoadProductTypeAllFail: {
            return {
                ...state,
                productTypesAll: [],
            };
        }
        case ProductTypeActionTypes.CreateProductTypeSuccess: {
            const productType = action.payload;
            return {
                ...state,
                productTypes: [...state.productTypes, productType],
                currentProductTypeId: productType.ProductTypeId,
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductTypeActionTypes.CreateProductTypeFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case ProductTypeActionTypes.UpdateProductTypeSuccess: {
            const productType = action.payload;
            const updatedProductTypes = state.productTypes.map(
                item => productType.ProductTypeId === item.ProductTypeId ? productType : item);

            return {
                ...state,
                productTypes: updatedProductTypes,
                currentProductTypeId: productType.ProductTypeId,
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductTypeActionTypes.UpdateProductTypeFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case ProductTypeActionTypes.DeleteProductTypeSuccess: {
            return {
                ...state,
                productTypes: state.productTypes.filter(productType => productType.ProductTypeId !== action.payload),
                currentProductTypeId: null,
                productTypeDataSourceParameters: new DataSourceParameters(
                    state.productTypeDataSourceParameters.sortColumn,
                    state.productTypeDataSourceParameters.sortDirection,
                    0,
                    state.productTypeDataSourceParameters.pageSize,
                    state.productTypeDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductTypeActionTypes.DeleteProductTypeFail: {
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

export const getProductTypeLoaded = (state: ProductTypeState) => state.loaded;
export const getProductTypeLoading = (state: ProductTypeState) => state.loading;
export const getCurrentProductTypeId = (state: ProductTypeState) => state.currentProductTypeId;
export const getProductTypes = (state: ProductTypeState) => state.productTypes;
export const getProductTypesAll = (state: ProductTypeState) => state.productTypesAll;
export const getProductTypeCount = (state: ProductTypeState) => state.productTypeCount;
export const getProductTypeDataSourceParameters = (state: ProductTypeState) => state.productTypeDataSourceParameters;
export const getProductTypeActionSucceeded = (state: ProductTypeState) => state.actionSucceeded;
export const getProductTypeError = (state: ProductTypeState) => state.error;
