import { DealerType } from "../../models/dealertype";
import { DealerTypeActions, DealerTypeActionTypes } from "../actions/dealertype.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface DealerTypeState {
    loaded: boolean;
    loading: boolean;
    currentDealerTypeId: number | null;
    dealerTypes: DealerType[];
    dealerTypesAll: DealerType[];
    dealerTypeCount: number;
    dealerTypeDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: DealerTypeState = {
    loaded: false,
    loading: false,
    currentDealerTypeId: null,
    dealerTypes: [],
    dealerTypesAll: [],
    dealerTypeCount: 0,
    dealerTypeDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: DealerTypeActions): DealerTypeState {

    switch (action.type) {
        case DealerTypeActionTypes.SetCurrentDealerType: {
            return {
                ...state,
                currentDealerTypeId: action.payload.DealerTypeId,
                error: ''
            };
        }
        case DealerTypeActionTypes.ClearCurrentDealerType: {
            return {
                ...state,
                currentDealerTypeId: null,
                error: ''
            };
        }
        case DealerTypeActionTypes.InitializeCurrentDealerType: {
            return {
                ...state,
                currentDealerTypeId: 0,
                error: ''
            };
        }
        case DealerTypeActionTypes.SetDealerTypeDataSourceParameters: {
            return {
                ...state,
                dealerTypeDataSourceParameters: action.payload
            };
        }
        case DealerTypeActionTypes.LoadDealerType: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case DealerTypeActionTypes.LoadDealerTypeSuccess: {
            const dealerTypes = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                dealerTypes,
                dealerTypeCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case DealerTypeActionTypes.LoadDealerTypeFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                dealerTypes: [],
                dealerTypeCount: 0,
                error: action.payload
            };
        }
        case DealerTypeActionTypes.LoadDealerTypeAll: {
            return {
                ...state,
            };
        }
        case DealerTypeActionTypes.LoadDealerTypeAllSuccess: {
            const dealerTypes = action.payload.value;
            return {
                ...state,
                dealerTypesAll: dealerTypes,
            };
        }
        case DealerTypeActionTypes.LoadDealerTypeAllFail: {
            return {
                ...state,
                dealerTypesAll: [],
            };
        }
        case DealerTypeActionTypes.CreateDealerTypeSuccess: {
            const dealerType = action.payload;
            return {
                ...state,
                dealerTypes: [...state.dealerTypes, dealerType],
                currentDealerTypeId: dealerType.DealerTypeId,
                actionSucceeded: true,
                error: ''
            };
        }
        case DealerTypeActionTypes.CreateDealerTypeFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case DealerTypeActionTypes.UpdateDealerTypeSuccess: {
            const dealerType = action.payload;
            const updatedDealerTypes = state.dealerTypes.map(
                item => dealerType.DealerTypeId === item.DealerTypeId ? dealerType : item);

            return {
                ...state,
                dealerTypes: updatedDealerTypes,
                currentDealerTypeId: dealerType.DealerTypeId,
                actionSucceeded: true,
                error: ''
            };
        }
        case DealerTypeActionTypes.UpdateDealerTypeFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case DealerTypeActionTypes.DeleteDealerTypeSuccess: {
            return {
                ...state,
                dealerTypes: state.dealerTypes.filter(dealerType => dealerType.DealerTypeId !== action.payload),
                currentDealerTypeId: null,
                dealerTypeDataSourceParameters: new DataSourceParameters(
                    state.dealerTypeDataSourceParameters.sortColumn,
                    state.dealerTypeDataSourceParameters.sortDirection,
                    0,
                    state.dealerTypeDataSourceParameters.pageSize,
                    state.dealerTypeDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case DealerTypeActionTypes.DeleteDealerTypeFail: {
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

export const getDealerTypeLoaded = (state: DealerTypeState) => state.loaded;
export const getDealerTypeLoading = (state: DealerTypeState) => state.loading;
export const getCurrentDealerTypeId = (state: DealerTypeState) => state.currentDealerTypeId;
export const getDealerTypes = (state: DealerTypeState) => state.dealerTypes;
export const getDealerTypesAll = (state: DealerTypeState) => state.dealerTypesAll;
export const getDealerTypeCount = (state: DealerTypeState) => state.dealerTypeCount;
export const getDealerTypeDataSourceParameters = (state: DealerTypeState) => state.dealerTypeDataSourceParameters;
export const getDealerTypeActionSucceeded = (state: DealerTypeState) => state.actionSucceeded;
export const getDealerTypeError = (state: DealerTypeState) => state.error;
