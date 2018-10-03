import { SalesOrderDetail } from "../../models/salesorderdetail";
import { SalesOrderDetailActions, SalesOrderDetailActionTypes } from "../actions/salesorderdetail.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface SalesOrderDetailState {
    loaded: boolean;
    loading: boolean;
    currentSalesOrderDetailId: number | null;
    salesOrderDetails: SalesOrderDetail[];
    salesOrderDetailsAll: SalesOrderDetail[];
    salesOrderDetailCount: number;
    salesOrderDetailDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: SalesOrderDetailState = {
    loaded: false,
    loading: false,
    currentSalesOrderDetailId: null,
    salesOrderDetails: [],
    salesOrderDetailsAll: [],
    salesOrderDetailCount: 0,
    salesOrderDetailDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: SalesOrderDetailActions): SalesOrderDetailState {

    switch (action.type) {
        case SalesOrderDetailActionTypes.SetCurrentSalesOrderDetail: {
            return {
                ...state,
                currentSalesOrderDetailId: action.payload.SalesOrderDetailId,
                error: ''
            };
        }
        case SalesOrderDetailActionTypes.ClearCurrentSalesOrderDetail: {
            return {
                ...state,
                currentSalesOrderDetailId: null,
                error: ''
            };
        }
        case SalesOrderDetailActionTypes.InitializeCurrentSalesOrderDetail: {
            return {
                ...state,
                currentSalesOrderDetailId: 0,
                error: ''
            };
        }
        case SalesOrderDetailActionTypes.SetSalesOrderDetailDataSourceParameters: {
            return {
                ...state,
                salesOrderDetailDataSourceParameters: action.payload
            };
        }
        case SalesOrderDetailActionTypes.LoadSalesOrderDetail: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case SalesOrderDetailActionTypes.LoadSalesOrderDetailSuccess: {
            const salesOrderDetails = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                salesOrderDetails,
                salesOrderDetailCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case SalesOrderDetailActionTypes.LoadSalesOrderDetailFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                salesOrderDetails: [],
                salesOrderDetailCount: 0,
                error: action.payload
            };
        }
        case SalesOrderDetailActionTypes.LoadSalesOrderDetailAll: {
            return {
                ...state,
            };
        }
        case SalesOrderDetailActionTypes.LoadSalesOrderDetailAllSuccess: {
            const salesOrderDetails = action.payload.value;
            return {
                ...state,
                salesOrderDetailsAll: salesOrderDetails,
            };
        }
        case SalesOrderDetailActionTypes.LoadSalesOrderDetailAllFail: {
            return {
                ...state,
                salesOrderDetailsAll: [],
            };
        }
        case SalesOrderDetailActionTypes.CreateSalesOrderDetailSuccess: {
            const salesOrderDetail = action.payload;
            return {
                ...state,
                salesOrderDetails: [...state.salesOrderDetails, salesOrderDetail],
                currentSalesOrderDetailId: salesOrderDetail.SalesOrderDetailId,
                actionSucceeded: true,
                error: ''
            };
        }
        case SalesOrderDetailActionTypes.CreateSalesOrderDetailFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case SalesOrderDetailActionTypes.UpdateSalesOrderDetailSuccess: {
            const salesOrderDetail = action.payload;
            const updatedSalesOrderDetails = state.salesOrderDetails.map(
                item => salesOrderDetail.SalesOrderDetailId === item.SalesOrderDetailId ? salesOrderDetail : item);

            return {
                ...state,
                salesOrderDetails: updatedSalesOrderDetails,
                currentSalesOrderDetailId: salesOrderDetail.SalesOrderDetailId,
                actionSucceeded: true,
                error: ''
            };
        }
        case SalesOrderDetailActionTypes.UpdateSalesOrderDetailFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case SalesOrderDetailActionTypes.DeleteSalesOrderDetailSuccess: {
            return {
                ...state,
                salesOrderDetails: state.salesOrderDetails.filter(salesOrderDetail => salesOrderDetail.SalesOrderDetailId !== action.payload),
                currentSalesOrderDetailId: null,
                salesOrderDetailDataSourceParameters: new DataSourceParameters(
                    state.salesOrderDetailDataSourceParameters.sortColumn,
                    state.salesOrderDetailDataSourceParameters.sortDirection,
                    0,
                    state.salesOrderDetailDataSourceParameters.pageSize,
                    state.salesOrderDetailDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case SalesOrderDetailActionTypes.DeleteSalesOrderDetailFail: {
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

export const getSalesOrderDetailLoaded = (state: SalesOrderDetailState) => state.loaded;
export const getSalesOrderDetailLoading = (state: SalesOrderDetailState) => state.loading;
export const getCurrentSalesOrderDetailId = (state: SalesOrderDetailState) => state.currentSalesOrderDetailId;
export const getSalesOrderDetails = (state: SalesOrderDetailState) => state.salesOrderDetails;
export const getSalesOrderDetailsAll = (state: SalesOrderDetailState) => state.salesOrderDetailsAll;
export const getSalesOrderDetailCount = (state: SalesOrderDetailState) => state.salesOrderDetailCount;
export const getSalesOrderDetailDataSourceParameters = (state: SalesOrderDetailState) => state.salesOrderDetailDataSourceParameters;
export const getSalesOrderDetailActionSucceeded = (state: SalesOrderDetailState) => state.actionSucceeded;
export const getSalesOrderDetailError = (state: SalesOrderDetailState) => state.error;
