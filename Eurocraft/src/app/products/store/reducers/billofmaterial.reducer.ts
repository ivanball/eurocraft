import { BillOfMaterial } from "../../models/billOfMaterial";
import { BillOfMaterialActions, BillOfMaterialActionTypes } from "../actions/billofmaterial.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface BillOfMaterialState {
    loaded: boolean;
    loading: boolean;
    currentBillOfMaterialsId: number | null;
    billOfMaterials: BillOfMaterial[];
    billOfMaterialsAll: BillOfMaterial[];
    billOfMaterialCount: number;
    billOfMaterialDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: BillOfMaterialState = {
    loaded: false,
    loading: false,
    currentBillOfMaterialsId: null,
    billOfMaterials: [],
    billOfMaterialsAll: [],
    billOfMaterialCount: 0,
    billOfMaterialDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: BillOfMaterialActions): BillOfMaterialState {

    switch (action.type) {
        case BillOfMaterialActionTypes.SetCurrentBillOfMaterial: {
            return {
                ...state,
                currentBillOfMaterialsId: action.payload.BillOfMaterialsId,
                error: ''
            };
        }
        case BillOfMaterialActionTypes.ClearCurrentBillOfMaterial: {
            return {
                ...state,
                currentBillOfMaterialsId: null,
                error: ''
            };
        }
        case BillOfMaterialActionTypes.InitializeCurrentBillOfMaterial: {
            return {
                ...state,
                currentBillOfMaterialsId: 0,
                error: ''
            };
        }
        case BillOfMaterialActionTypes.SetBillOfMaterialDataSourceParameters: {
            return {
                ...state,
                billOfMaterialDataSourceParameters: action.payload
            };
        }
        case BillOfMaterialActionTypes.LoadBillOfMaterial: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case BillOfMaterialActionTypes.LoadBillOfMaterialSuccess: {
            const billOfMaterials = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                billOfMaterials,
                billOfMaterialCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case BillOfMaterialActionTypes.LoadBillOfMaterialFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                billOfMaterials: [],
                billOfMaterialCount: 0,
                error: action.payload
            };
        }
        case BillOfMaterialActionTypes.LoadBillOfMaterialAll: {
            return {
                ...state,
            };
        }
        case BillOfMaterialActionTypes.LoadBillOfMaterialAllSuccess: {
            const billOfMaterials = action.payload.value;
            return {
                ...state,
                billOfMaterialsAll: billOfMaterials,
            };
        }
        case BillOfMaterialActionTypes.LoadBillOfMaterialAllFail: {
            return {
                ...state,
                billOfMaterialsAll: [],
            };
        }
        case BillOfMaterialActionTypes.CreateBillOfMaterialSuccess: {
            const billOfMaterial = action.payload;
            return {
                ...state,
                billOfMaterials: [...state.billOfMaterials, billOfMaterial],
                currentBillOfMaterialsId: billOfMaterial.BillOfMaterialsId,
                actionSucceeded: true,
                error: ''
            };
        }
        case BillOfMaterialActionTypes.CreateBillOfMaterialFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case BillOfMaterialActionTypes.UpdateBillOfMaterialSuccess: {
            const billOfMaterial = action.payload;
            const updatedBillOfMaterials = state.billOfMaterials.map(
                item => billOfMaterial.BillOfMaterialsId === item.BillOfMaterialsId ? billOfMaterial : item);

            return {
                ...state,
                billOfMaterials: updatedBillOfMaterials,
                currentBillOfMaterialsId: billOfMaterial.BillOfMaterialsId,
                actionSucceeded: true,
                error: ''
            };
        }
        case BillOfMaterialActionTypes.UpdateBillOfMaterialFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case BillOfMaterialActionTypes.DeleteBillOfMaterialSuccess: {
            return {
                ...state,
                billOfMaterials: state.billOfMaterials.filter(billOfMaterial => billOfMaterial.BillOfMaterialsId !== action.payload),
                currentBillOfMaterialsId: null,
                billOfMaterialDataSourceParameters: new DataSourceParameters(
                    state.billOfMaterialDataSourceParameters.sortColumn,
                    state.billOfMaterialDataSourceParameters.sortDirection,
                    0,
                    state.billOfMaterialDataSourceParameters.pageSize,
                    state.billOfMaterialDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case BillOfMaterialActionTypes.DeleteBillOfMaterialFail: {
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

export const getBillOfMaterialLoaded = (state: BillOfMaterialState) => state.loaded;
export const getBillOfMaterialLoading = (state: BillOfMaterialState) => state.loading;
export const getCurrentBillOfMaterialsId = (state: BillOfMaterialState) => state.currentBillOfMaterialsId;
export const getBillOfMaterials = (state: BillOfMaterialState) => state.billOfMaterials;
export const getBillOfMaterialsAll = (state: BillOfMaterialState) => state.billOfMaterialsAll;
export const getBillOfMaterialCount = (state: BillOfMaterialState) => state.billOfMaterialCount;
export const getBillOfMaterialDataSourceParameters = (state: BillOfMaterialState) => state.billOfMaterialDataSourceParameters;
export const getBillOfMaterialActionSucceeded = (state: BillOfMaterialState) => state.actionSucceeded;
export const getBillOfMaterialError = (state: BillOfMaterialState) => state.error;
