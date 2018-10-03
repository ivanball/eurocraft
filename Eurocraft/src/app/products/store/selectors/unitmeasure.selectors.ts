import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromUnitMeasure from '../reducers/unitmeasure.reducer';

export const getUnitMeasureState = createSelector(
    fromFeature.getProductsState,
    (state: fromFeature.ProductsState) => state.unitMeasureState
);

export const getUnitMeasureLoaded = createSelector(
    getUnitMeasureState,
    fromUnitMeasure.getUnitMeasureLoaded
);

export const getUnitMeasureLoading = createSelector(
    getUnitMeasureState,
    fromUnitMeasure.getUnitMeasureLoading
);

export const getCurrentUnitMeasureId = createSelector(
    getUnitMeasureState,
    state => state.currentUnitMeasureId
);

export const getCurrentUnitMeasure = createSelector(
    getUnitMeasureState,
    getCurrentUnitMeasureId,
    (state, currentUnitMeasureId) => {
        if (currentUnitMeasureId === 0) {
            return {
                UnitMeasureId: 0,
                UnitMeasureCode: '',
                UnitMeasureName: ''
            };
        } else {
            return currentUnitMeasureId ? state.unitMeasures.find(p => p.UnitMeasureId === currentUnitMeasureId) : null;
        }
    }
);

export const getUnitMeasures = createSelector(
    getUnitMeasureState,
    state => state.unitMeasures
);

export const getUnitMeasuresAll = createSelector(
    getUnitMeasureState,
    state => state.unitMeasuresAll
);

export const getUnitMeasureCount = createSelector(
    getUnitMeasureState,
    state => state.unitMeasureCount
);

export const getUnitMeasureDataSourceParameters = createSelector(
    getUnitMeasureState,
    state => state.unitMeasureDataSourceParameters
);

export const getUnitMeasureActionSucceeded = createSelector(
    getUnitMeasureState,
    fromUnitMeasure.getUnitMeasureActionSucceeded
);

export const getUnitMeasureError = createSelector(
    getUnitMeasureState,
    state => state.error
);
