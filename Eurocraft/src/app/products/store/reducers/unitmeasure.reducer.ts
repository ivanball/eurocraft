import { UnitMeasure } from "../../models/unitmeasure";
import { UnitMeasureActions, UnitMeasureActionTypes } from "../actions/unitmeasure.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface UnitMeasureState {
    loaded: boolean;
    loading: boolean;
    currentUnitMeasureId: number | null;
    unitMeasures: UnitMeasure[];
    unitMeasuresAll: UnitMeasure[];
    unitMeasureCount: number;
    unitMeasureDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: UnitMeasureState = {
    loaded: false,
    loading: false,
    currentUnitMeasureId: null,
    unitMeasures: [],
    unitMeasuresAll: [],
    unitMeasureCount: 0,
    unitMeasureDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: UnitMeasureActions): UnitMeasureState {

    switch (action.type) {
        case UnitMeasureActionTypes.SetCurrentUnitMeasure: {
            return {
                ...state,
                currentUnitMeasureId: action.payload.UnitMeasureId,
                error: ''
            };
        }
        case UnitMeasureActionTypes.ClearCurrentUnitMeasure: {
            return {
                ...state,
                currentUnitMeasureId: null,
                error: ''
            };
        }
        case UnitMeasureActionTypes.InitializeCurrentUnitMeasure: {
            return {
                ...state,
                currentUnitMeasureId: 0,
                error: ''
            };
        }
        case UnitMeasureActionTypes.SetUnitMeasureDataSourceParameters: {
            return {
                ...state,
                unitMeasureDataSourceParameters: action.payload
            };
        }
        case UnitMeasureActionTypes.LoadUnitMeasure: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case UnitMeasureActionTypes.LoadUnitMeasureSuccess: {
            const unitMeasures = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                unitMeasures,
                unitMeasureCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case UnitMeasureActionTypes.LoadUnitMeasureFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                unitMeasures: [],
                unitMeasureCount: 0,
                error: action.payload
            };
        }
        case UnitMeasureActionTypes.LoadUnitMeasureAll: {
            return {
                ...state,
            };
        }
        case UnitMeasureActionTypes.LoadUnitMeasureAllSuccess: {
            const unitMeasures = action.payload.value;
            return {
                ...state,
                unitMeasuresAll: unitMeasures,
            };
        }
        case UnitMeasureActionTypes.LoadUnitMeasureAllFail: {
            return {
                ...state,
                unitMeasuresAll: [],
            };
        }
        case UnitMeasureActionTypes.CreateUnitMeasureSuccess: {
            const unitMeasure = action.payload;
            return {
                ...state,
                unitMeasures: [...state.unitMeasures, unitMeasure],
                currentUnitMeasureId: unitMeasure.UnitMeasureId,
                actionSucceeded: true,
                error: ''
            };
        }
        case UnitMeasureActionTypes.CreateUnitMeasureFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case UnitMeasureActionTypes.UpdateUnitMeasureSuccess: {
            const unitMeasure = action.payload;
            const updatedUnitMeasures = state.unitMeasures.map(
                item => unitMeasure.UnitMeasureId === item.UnitMeasureId ? unitMeasure : item);

            return {
                ...state,
                unitMeasures: updatedUnitMeasures,
                currentUnitMeasureId: unitMeasure.UnitMeasureId,
                actionSucceeded: true,
                error: ''
            };
        }
        case UnitMeasureActionTypes.UpdateUnitMeasureFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case UnitMeasureActionTypes.DeleteUnitMeasureSuccess: {
            return {
                ...state,
                unitMeasures: state.unitMeasures.filter(unitMeasure => unitMeasure.UnitMeasureId !== action.payload),
                currentUnitMeasureId: null,
                unitMeasureDataSourceParameters: new DataSourceParameters(
                    state.unitMeasureDataSourceParameters.sortColumn,
                    state.unitMeasureDataSourceParameters.sortDirection,
                    0,
                    state.unitMeasureDataSourceParameters.pageSize,
                    state.unitMeasureDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case UnitMeasureActionTypes.DeleteUnitMeasureFail: {
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

export const getUnitMeasureLoaded = (state: UnitMeasureState) => state.loaded;
export const getUnitMeasureLoading = (state: UnitMeasureState) => state.loading;
export const getCurrentUnitMeasureId = (state: UnitMeasureState) => state.currentUnitMeasureId;
export const getUnitMeasures = (state: UnitMeasureState) => state.unitMeasures;
export const getUnitMeasuresAll = (state: UnitMeasureState) => state.unitMeasuresAll;
export const getUnitMeasureCount = (state: UnitMeasureState) => state.unitMeasureCount;
export const getUnitMeasureDataSourceParameters = (state: UnitMeasureState) => state.unitMeasureDataSourceParameters;
export const getUnitMeasureActionSucceeded = (state: UnitMeasureState) => state.actionSucceeded;
export const getUnitMeasureError = (state: UnitMeasureState) => state.error;
