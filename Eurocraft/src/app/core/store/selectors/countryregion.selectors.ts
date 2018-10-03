import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromCountryRegion from '../reducers/countryregion.reducer';

export const getCountryRegionState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.CoreState) => state.countryRegionState
);

export const getCountryRegionLoaded = createSelector(
    getCountryRegionState,
    fromCountryRegion.getCountryRegionLoaded
);

export const getCountryRegionLoading = createSelector(
    getCountryRegionState,
    fromCountryRegion.getCountryRegionLoading
);

export const getCurrentCountryRegionId = createSelector(
    getCountryRegionState,
    state => state.currentCountryRegionId
);

export const getCurrentCountryRegion = createSelector(
    getCountryRegionState,
    getCurrentCountryRegionId,
    (state, currentCountryRegionId) => {
        if (currentCountryRegionId === 0) {
            return {
                CountryRegionId: 0,
                CountryRegionCode: '',
                CountryRegionName: '',
            };
        } else {
            return currentCountryRegionId ? state.countryRegions.find(p => p.CountryRegionId === currentCountryRegionId) : null;
        }
    }
);

export const getCountryRegions = createSelector(
    getCountryRegionState,
    state => state.countryRegions
);

export const getCountryRegionsAll = createSelector(
    getCountryRegionState,
    state => state.countryRegionsAll
);

export const getCountryRegionCount = createSelector(
    getCountryRegionState,
    state => state.countryRegionCount
);

export const getCountryRegionDataSourceParameters = createSelector(
    getCountryRegionState,
    state => state.countryRegionDataSourceParameters
);

export const getCountryRegionActionSucceeded = createSelector(
    getCountryRegionState,
    fromCountryRegion.getCountryRegionActionSucceeded
);

export const getCountryRegionError = createSelector(
    getCountryRegionState,
    state => state.error
);
