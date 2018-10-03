import { Dealer } from "../../models/dealer";
import { DealerActions, DealerActionTypes } from "../actions/dealer.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface DealerState {
    loaded: boolean;
    loading: boolean;
    currentDealerId: number | null;
    dealers: Dealer[];
    dealersAll: Dealer[];
    dealerCount: number;
    dealerDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: DealerState = {
    loaded: false,
    loading: false,
    currentDealerId: null,
    dealers: [],
    dealersAll: [],
    dealerCount: 0,
    dealerDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: DealerActions): DealerState {

    switch (action.type) {
        case DealerActionTypes.SetCurrentDealer: {
            return {
                ...state,
                currentDealerId: action.payload.BusinessEntityId,
                error: ''
            };
        }
        case DealerActionTypes.ClearCurrentDealer: {
            return {
                ...state,
                currentDealerId: null,
                error: ''
            };
        }
        case DealerActionTypes.InitializeCurrentDealer: {
            return {
                ...state,
                currentDealerId: 0,
                error: ''
            };
        }
        case DealerActionTypes.SetDealerDataSourceParameters: {
            return {
                ...state,
                dealerDataSourceParameters: action.payload
            };
        }
        case DealerActionTypes.LoadDealer: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case DealerActionTypes.LoadDealerSuccess: {
            const dealers = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                dealers,
                dealerCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case DealerActionTypes.LoadDealerFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                dealers: [],
                dealerCount: 0,
                error: action.payload
            };
        }
        case DealerActionTypes.LoadDealerAll: {
            return {
                ...state,
            };
        }
        case DealerActionTypes.LoadDealerAllSuccess: {
            const dealers = action.payload.value;
            return {
                ...state,
                dealersAll: dealers,
            };
        }
        case DealerActionTypes.LoadDealerAllFail: {
            return {
                ...state,
                dealersAll: [],
            };
        }
        case DealerActionTypes.CreateDealerSuccess: {
            const dealer = action.payload;
            return {
                ...state,
                dealers: [...state.dealers, dealer],
                currentDealerId: dealer.BusinessEntityId,
                actionSucceeded: true,
                error: ''
            };
        }
        case DealerActionTypes.CreateDealerFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case DealerActionTypes.UpdateDealerSuccess: {
            const dealer = action.payload;
            const updatedDealers = state.dealers.map(
                item => dealer.BusinessEntityId === item.BusinessEntityId ? dealer : item);

            return {
                ...state,
                dealers: updatedDealers,
                currentDealerId: dealer.BusinessEntityId,
                actionSucceeded: true,
                error: ''
            };
        }
        case DealerActionTypes.UpdateDealerFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case DealerActionTypes.DeleteDealerSuccess: {
            return {
                ...state,
                dealers: state.dealers.filter(dealer => dealer.BusinessEntityId !== action.payload),
                currentDealerId: null,
                dealerDataSourceParameters: new DataSourceParameters(
                    state.dealerDataSourceParameters.sortColumn,
                    state.dealerDataSourceParameters.sortDirection,
                    0,
                    state.dealerDataSourceParameters.pageSize,
                    state.dealerDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case DealerActionTypes.DeleteDealerFail: {
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

export const getDealerLoaded = (state: DealerState) => state.loaded;
export const getDealerLoading = (state: DealerState) => state.loading;
export const getCurrentDealerId = (state: DealerState) => state.currentDealerId;
export const getDealers = (state: DealerState) => state.dealers;
export const getDealersAll = (state: DealerState) => state.dealersAll;
export const getDealerCount = (state: DealerState) => state.dealerCount;
export const getDealerDataSourceParameters = (state: DealerState) => state.dealerDataSourceParameters;
export const getDealerActionSucceeded = (state: DealerState) => state.actionSucceeded;
export const getDealerError = (state: DealerState) => state.error;
