import { StateProvince } from "../../models/stateprovince";
import { StateProvinceActions, StateProvinceActionTypes } from "../actions/stateprovince.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface StateProvinceState {
    loaded: boolean;
    loading: boolean;
    currentStateProvinceId: number | null;
    stateProvinces: StateProvince[];
    stateProvincesAll: StateProvince[];
    stateProvinceCount: number;
    stateProvinceDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: StateProvinceState = {
    loaded: false,
    loading: false,
    currentStateProvinceId: null,
    stateProvinces: [],
    stateProvincesAll: [],
    stateProvinceCount: 0,
    stateProvinceDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: StateProvinceActions): StateProvinceState {

    switch (action.type) {
        case StateProvinceActionTypes.SetCurrentStateProvince: {
            return {
                ...state,
                currentStateProvinceId: action.payload.StateProvinceId,
                error: ''
            };
        }
        case StateProvinceActionTypes.ClearCurrentStateProvince: {
            return {
                ...state,
                currentStateProvinceId: null,
                error: ''
            };
        }
        case StateProvinceActionTypes.InitializeCurrentStateProvince: {
            return {
                ...state,
                currentStateProvinceId: 0,
                error: ''
            };
        }
        case StateProvinceActionTypes.SetStateProvinceDataSourceParameters: {
            return {
                ...state,
                stateProvinceDataSourceParameters: action.payload
            };
        }
        case StateProvinceActionTypes.LoadStateProvince: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case StateProvinceActionTypes.LoadStateProvinceSuccess: {
            const stateProvinces = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                stateProvinces,
                stateProvinceCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case StateProvinceActionTypes.LoadStateProvinceFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                stateProvinces: [],
                stateProvinceCount: 0,
                error: action.payload
            };
        }
        case StateProvinceActionTypes.LoadStateProvinceAll: {
            return {
                ...state,
            };
        }
        case StateProvinceActionTypes.LoadStateProvinceAllSuccess: {
            const stateProvinces = action.payload.value;
            return {
                ...state,
                stateProvincesAll: stateProvinces,
            };
        }
        case StateProvinceActionTypes.LoadStateProvinceAllFail: {
            return {
                ...state,
                stateProvincesAll: [],
            };
        }
        case StateProvinceActionTypes.CreateStateProvinceSuccess: {
            const stateProvince = action.payload;
            return {
                ...state,
                stateProvinces: [...state.stateProvinces, stateProvince],
                currentStateProvinceId: stateProvince.StateProvinceId,
                actionSucceeded: true,
                error: ''
            };
        }
        case StateProvinceActionTypes.CreateStateProvinceFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case StateProvinceActionTypes.UpdateStateProvinceSuccess: {
            const stateProvince = action.payload;
            const updatedStateProvinces = state.stateProvinces.map(
                item => stateProvince.StateProvinceId === item.StateProvinceId ? stateProvince : item);

            return {
                ...state,
                stateProvinces: updatedStateProvinces,
                currentStateProvinceId: stateProvince.StateProvinceId,
                actionSucceeded: true,
                error: ''
            };
        }
        case StateProvinceActionTypes.UpdateStateProvinceFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case StateProvinceActionTypes.DeleteStateProvinceSuccess: {
            return {
                ...state,
                stateProvinces: state.stateProvinces.filter(stateProvince => stateProvince.StateProvinceId !== action.payload),
                currentStateProvinceId: null,
                stateProvinceDataSourceParameters: new DataSourceParameters(
                    state.stateProvinceDataSourceParameters.sortColumn,
                    state.stateProvinceDataSourceParameters.sortDirection,
                    0,
                    state.stateProvinceDataSourceParameters.pageSize,
                    state.stateProvinceDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case StateProvinceActionTypes.DeleteStateProvinceFail: {
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

export const getStateProvinceLoaded = (state: StateProvinceState) => state.loaded;
export const getStateProvinceLoading = (state: StateProvinceState) => state.loading;
export const getCurrentStateProvinceId = (state: StateProvinceState) => state.currentStateProvinceId;
export const getStateProvinces = (state: StateProvinceState) => state.stateProvinces;
export const getStateProvincesAll = (state: StateProvinceState) => state.stateProvincesAll;
export const getStateProvinceCount = (state: StateProvinceState) => state.stateProvinceCount;
export const getStateProvinceDataSourceParameters = (state: StateProvinceState) => state.stateProvinceDataSourceParameters;
export const getStateProvinceActionSucceeded = (state: StateProvinceState) => state.actionSucceeded;
export const getStateProvinceError = (state: StateProvinceState) => state.error;
