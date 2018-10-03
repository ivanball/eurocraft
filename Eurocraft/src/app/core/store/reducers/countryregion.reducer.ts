import { CountryRegion } from "../../models/countryregion";
import { CountryRegionActions, CountryRegionActionTypes } from "../actions/countryregion.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface CountryRegionState {
    loaded: boolean;
    loading: boolean;
    currentCountryRegionId: number | null;
    countryRegions: CountryRegion[];
    countryRegionsAll: CountryRegion[];
    countryRegionCount: number;
    countryRegionDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: CountryRegionState = {
    loaded: false,
    loading: false,
    currentCountryRegionId: null,
    countryRegions: [],
    countryRegionsAll: [],
    countryRegionCount: 0,
    countryRegionDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: CountryRegionActions): CountryRegionState {

    switch (action.type) {
        case CountryRegionActionTypes.SetCurrentCountryRegion: {
            return {
                ...state,
                currentCountryRegionId: action.payload.CountryRegionId,
                error: ''
            };
        }
        case CountryRegionActionTypes.ClearCurrentCountryRegion: {
            return {
                ...state,
                currentCountryRegionId: null,
                error: ''
            };
        }
        case CountryRegionActionTypes.InitializeCurrentCountryRegion: {
            return {
                ...state,
                currentCountryRegionId: 0,
                error: ''
            };
        }
        case CountryRegionActionTypes.SetCountryRegionDataSourceParameters: {
            return {
                ...state,
                countryRegionDataSourceParameters: action.payload
            };
        }
        case CountryRegionActionTypes.LoadCountryRegion: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case CountryRegionActionTypes.LoadCountryRegionSuccess: {
            const countryRegions = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                countryRegions,
                countryRegionCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case CountryRegionActionTypes.LoadCountryRegionFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                countryRegions: [],
                countryRegionCount: 0,
                error: action.payload
            };
        }
        case CountryRegionActionTypes.LoadCountryRegionAll: {
            return {
                ...state,
            };
        }
        case CountryRegionActionTypes.LoadCountryRegionAllSuccess: {
            const countryRegions = action.payload.value;
            return {
                ...state,
                countryRegionsAll: countryRegions,
            };
        }
        case CountryRegionActionTypes.LoadCountryRegionAllFail: {
            return {
                ...state,
                countryRegionsAll: [],
            };
        }
        case CountryRegionActionTypes.CreateCountryRegionSuccess: {
            const countryRegion = action.payload;
            return {
                ...state,
                countryRegions: [...state.countryRegions, countryRegion],
                currentCountryRegionId: countryRegion.CountryRegionId,
                actionSucceeded: true,
                error: ''
            };
        }
        case CountryRegionActionTypes.CreateCountryRegionFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case CountryRegionActionTypes.UpdateCountryRegionSuccess: {
            const countryRegion = action.payload;
            const updatedCountryRegions = state.countryRegions.map(
                item => countryRegion.CountryRegionId === item.CountryRegionId ? countryRegion : item);

            return {
                ...state,
                countryRegions: updatedCountryRegions,
                currentCountryRegionId: countryRegion.CountryRegionId,
                actionSucceeded: true,
                error: ''
            };
        }
        case CountryRegionActionTypes.UpdateCountryRegionFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case CountryRegionActionTypes.DeleteCountryRegionSuccess: {
            return {
                ...state,
                countryRegions: state.countryRegions.filter(countryRegion => countryRegion.CountryRegionId !== action.payload),
                currentCountryRegionId: null,
                countryRegionDataSourceParameters: new DataSourceParameters(
                    state.countryRegionDataSourceParameters.sortColumn,
                    state.countryRegionDataSourceParameters.sortDirection,
                    0,
                    state.countryRegionDataSourceParameters.pageSize,
                    state.countryRegionDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case CountryRegionActionTypes.DeleteCountryRegionFail: {
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

export const getCountryRegionLoaded = (state: CountryRegionState) => state.loaded;
export const getCountryRegionLoading = (state: CountryRegionState) => state.loading;
export const getCurrentCountryRegionId = (state: CountryRegionState) => state.currentCountryRegionId;
export const getCountryRegions = (state: CountryRegionState) => state.countryRegions;
export const getCountryRegionsAll = (state: CountryRegionState) => state.countryRegionsAll;
export const getCountryRegionCount = (state: CountryRegionState) => state.countryRegionCount;
export const getCountryRegionDataSourceParameters = (state: CountryRegionState) => state.countryRegionDataSourceParameters;
export const getCountryRegionActionSucceeded = (state: CountryRegionState) => state.actionSucceeded;
export const getCountryRegionError = (state: CountryRegionState) => state.error;
