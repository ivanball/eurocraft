import { SalesOrderHeader } from "../../models/salesorderheader";
import { SalesOrderHeaderActions, SalesOrderHeaderActionTypes } from "../actions/salesorderheader.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface SalesOrderHeaderState {
    loaded: boolean;
    loading: boolean;
    currentSalesOrderId: number | null;
    salesOrderHeaders: SalesOrderHeader[];
    salesOrderHeadersAll: SalesOrderHeader[];
    salesOrderHeaderCount: number;
    salesOrderHeaderDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: SalesOrderHeaderState = {
    loaded: false,
    loading: false,
    currentSalesOrderId: null,
    salesOrderHeaders: [],
    salesOrderHeadersAll: [],
    salesOrderHeaderCount: 0,
    salesOrderHeaderDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: SalesOrderHeaderActions): SalesOrderHeaderState {

    switch (action.type) {
        case SalesOrderHeaderActionTypes.SetCurrentSalesOrderHeader: {
            return {
                ...state,
                currentSalesOrderId: action.payload.SalesOrderId,
                error: ''
            };
        }
        case SalesOrderHeaderActionTypes.ClearCurrentSalesOrderHeader: {
            return {
                ...state,
                currentSalesOrderId: null,
                error: ''
            };
        }
        case SalesOrderHeaderActionTypes.InitializeCurrentSalesOrderHeader: {
            return {
                ...state,
                currentSalesOrderId: 0,
                error: ''
            };
        }
        case SalesOrderHeaderActionTypes.SetSalesOrderHeaderDataSourceParameters: {
            return {
                ...state,
                salesOrderHeaderDataSourceParameters: action.payload
            };
        }
        case SalesOrderHeaderActionTypes.LoadSalesOrderHeader: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case SalesOrderHeaderActionTypes.LoadSalesOrderHeaderSuccess: {
            const salesOrderHeaders = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                salesOrderHeaders,
                salesOrderHeaderCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case SalesOrderHeaderActionTypes.LoadSalesOrderHeaderFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                salesOrderHeaders: [],
                salesOrderHeaderCount: 0,
                error: action.payload
            };
        }
        case SalesOrderHeaderActionTypes.LoadSalesOrderHeaderAll: {
            return {
                ...state,
            };
        }
        case SalesOrderHeaderActionTypes.LoadSalesOrderHeaderAllSuccess: {
            const salesOrderHeaders = action.payload.value;
            return {
                ...state,
                salesOrderHeadersAll: salesOrderHeaders,
            };
        }
        case SalesOrderHeaderActionTypes.LoadSalesOrderHeaderAllFail: {
            return {
                ...state,
                salesOrderHeadersAll: [],
            };
        }
        case SalesOrderHeaderActionTypes.CreateSalesOrderHeaderSuccess: {
            const salesOrderHeader = action.payload;
            return {
                ...state,
                salesOrderHeaders: [...state.salesOrderHeaders, salesOrderHeader],
                currentSalesOrderId: salesOrderHeader.SalesOrderId,
                actionSucceeded: true,
                error: ''
            };
        }
        case SalesOrderHeaderActionTypes.CreateSalesOrderHeaderFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case SalesOrderHeaderActionTypes.UpdateSalesOrderHeaderSuccess: {
            const salesOrderHeader = action.payload;
            const updatedSalesOrderHeaders = state.salesOrderHeaders.map(
                item => salesOrderHeader.SalesOrderId === item.SalesOrderId ? salesOrderHeader : item);

            return {
                ...state,
                salesOrderHeaders: updatedSalesOrderHeaders,
                currentSalesOrderId: salesOrderHeader.SalesOrderId,
                actionSucceeded: true,
                error: ''
            };
        }
        case SalesOrderHeaderActionTypes.UpdateSalesOrderHeaderFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case SalesOrderHeaderActionTypes.DeleteSalesOrderHeaderSuccess: {
            return {
                ...state,
                salesOrderHeaders: state.salesOrderHeaders.filter(salesOrderHeader => salesOrderHeader.SalesOrderId !== action.payload),
                currentSalesOrderId: null,
                salesOrderHeaderDataSourceParameters: new DataSourceParameters(
                    state.salesOrderHeaderDataSourceParameters.sortColumn,
                    state.salesOrderHeaderDataSourceParameters.sortDirection,
                    0,
                    state.salesOrderHeaderDataSourceParameters.pageSize,
                    state.salesOrderHeaderDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case SalesOrderHeaderActionTypes.DeleteSalesOrderHeaderFail: {
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

export const getSalesOrderHeaderLoaded = (state: SalesOrderHeaderState) => state.loaded;
export const getSalesOrderHeaderLoading = (state: SalesOrderHeaderState) => state.loading;
export const getCurrentSalesOrderId = (state: SalesOrderHeaderState) => state.currentSalesOrderId;
export const getSalesOrderHeaders = (state: SalesOrderHeaderState) => state.salesOrderHeaders;
export const getSalesOrderHeadersAll = (state: SalesOrderHeaderState) => state.salesOrderHeadersAll;
export const getSalesOrderHeaderCount = (state: SalesOrderHeaderState) => state.salesOrderHeaderCount;
export const getSalesOrderHeaderDataSourceParameters = (state: SalesOrderHeaderState) => state.salesOrderHeaderDataSourceParameters;
export const getSalesOrderHeaderActionSucceeded = (state: SalesOrderHeaderState) => state.actionSucceeded;
export const getSalesOrderHeaderError = (state: SalesOrderHeaderState) => state.error;
