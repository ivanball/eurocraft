import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromStateProvince from '../reducers/stateprovince.reducer';

export const getStateProvinceState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.CoreState) => state.stateProvinceState
);

export const getStateProvinceLoaded = createSelector(
    getStateProvinceState,
    fromStateProvince.getStateProvinceLoaded
);

export const getStateProvinceLoading = createSelector(
    getStateProvinceState,
    fromStateProvince.getStateProvinceLoading
);

export const getCurrentStateProvinceId = createSelector(
    getStateProvinceState,
    state => state.currentStateProvinceId
);

export const getCurrentStateProvince = createSelector(
    getStateProvinceState,
    getCurrentStateProvinceId,
    (state, currentStateProvinceId) => {
        if (currentStateProvinceId === 0) {
            return {
                StateProvinceId: 0,
                StateProvinceCode: '',
                StateProvinceName: '',
                CountryRegionId: null,
                CountryRegionName: ''
            };
        } else {
            return currentStateProvinceId ? state.stateProvinces.find(p => p.StateProvinceId === currentStateProvinceId) : null;
        }
    }
);

export const getStateProvinces = createSelector(
    getStateProvinceState,
    state => state.stateProvinces
);

export const getStateProvincesAll = createSelector(
    getStateProvinceState,
    state => state.stateProvincesAll
);

export const getStateProvinceCount = createSelector(
    getStateProvinceState,
    state => state.stateProvinceCount
);

export const getStateProvinceDataSourceParameters = createSelector(
    getStateProvinceState,
    state => state.stateProvinceDataSourceParameters
);

export const getStateProvinceActionSucceeded = createSelector(
    getStateProvinceState,
    fromStateProvince.getStateProvinceActionSucceeded
);

export const getStateProvinceError = createSelector(
    getStateProvinceState,
    state => state.error
);
