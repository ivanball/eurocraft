import { ProductMaterial } from "../../models/productmaterial";
import { ProductMaterialActions, ProductMaterialActionTypes } from "../actions/productmaterial.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface ProductMaterialState {
    loaded: boolean;
    loading: boolean;
    currentProductMaterialId: number | null;
    productMaterials: ProductMaterial[];
    productMaterialsAll: ProductMaterial[];
    productMaterialCount: number;
    productMaterialDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: ProductMaterialState = {
    loaded: false,
    loading: false,
    currentProductMaterialId: null,
    productMaterials: [],
    productMaterialsAll: [],
    productMaterialCount: 0,
    productMaterialDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: ProductMaterialActions): ProductMaterialState {

    switch (action.type) {
        case ProductMaterialActionTypes.SetCurrentProductMaterial: {
            return {
                ...state,
                currentProductMaterialId: action.payload.ProductMaterialId,
                error: ''
            };
        }
        case ProductMaterialActionTypes.ClearCurrentProductMaterial: {
            return {
                ...state,
                currentProductMaterialId: null,
                error: ''
            };
        }
        case ProductMaterialActionTypes.InitializeCurrentProductMaterial: {
            return {
                ...state,
                currentProductMaterialId: 0,
                error: ''
            };
        }
        case ProductMaterialActionTypes.SetProductMaterialDataSourceParameters: {
            return {
                ...state,
                productMaterialDataSourceParameters: action.payload
            };
        }
        case ProductMaterialActionTypes.LoadProductMaterial: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case ProductMaterialActionTypes.LoadProductMaterialSuccess: {
            const productMaterials = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                productMaterials,
                productMaterialCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case ProductMaterialActionTypes.LoadProductMaterialFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                productMaterials: [],
                productMaterialCount: 0,
                error: action.payload
            };
        }
        case ProductMaterialActionTypes.LoadProductMaterialAll: {
            return {
                ...state,
            };
        }
        case ProductMaterialActionTypes.LoadProductMaterialAllSuccess: {
            const productMaterials = action.payload.value;
            return {
                ...state,
                productMaterialsAll: productMaterials,
            };
        }
        case ProductMaterialActionTypes.LoadProductMaterialAllFail: {
            return {
                ...state,
                productMaterialsAll: [],
            };
        }
        case ProductMaterialActionTypes.CreateProductMaterialSuccess: {
            const productMaterial = action.payload;
            return {
                ...state,
                productMaterials: [...state.productMaterials, productMaterial],
                currentProductMaterialId: productMaterial.ProductMaterialId,
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductMaterialActionTypes.CreateProductMaterialFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case ProductMaterialActionTypes.UpdateProductMaterialSuccess: {
            const productMaterial = action.payload;
            const updatedProductMaterials = state.productMaterials.map(
                item => productMaterial.ProductMaterialId === item.ProductMaterialId ? productMaterial : item);

            return {
                ...state,
                productMaterials: updatedProductMaterials,
                currentProductMaterialId: productMaterial.ProductMaterialId,
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductMaterialActionTypes.UpdateProductMaterialFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case ProductMaterialActionTypes.DeleteProductMaterialSuccess: {
            return {
                ...state,
                productMaterials: state.productMaterials.filter(productMaterial => productMaterial.ProductMaterialId !== action.payload),
                currentProductMaterialId: null,
                productMaterialDataSourceParameters: new DataSourceParameters(
                    state.productMaterialDataSourceParameters.sortColumn,
                    state.productMaterialDataSourceParameters.sortDirection,
                    0,
                    state.productMaterialDataSourceParameters.pageSize,
                    state.productMaterialDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case ProductMaterialActionTypes.DeleteProductMaterialFail: {
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

export const getProductMaterialLoaded = (state: ProductMaterialState) => state.loaded;
export const getProductMaterialLoading = (state: ProductMaterialState) => state.loading;
export const getCurrentProductMaterialId = (state: ProductMaterialState) => state.currentProductMaterialId;
export const getProductMaterials = (state: ProductMaterialState) => state.productMaterials;
export const getProductMaterialsAll = (state: ProductMaterialState) => state.productMaterialsAll;
export const getProductMaterialCount = (state: ProductMaterialState) => state.productMaterialCount;
export const getProductMaterialDataSourceParameters = (state: ProductMaterialState) => state.productMaterialDataSourceParameters;
export const getProductMaterialActionSucceeded = (state: ProductMaterialState) => state.actionSucceeded;
export const getProductMaterialError = (state: ProductMaterialState) => state.error;
