import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromBillOfMaterial from '../reducers/billofmaterial.reducer';

export const getBillOfMaterialState = createSelector(
    fromFeature.getProductsState,
    (state: fromFeature.ProductsState) => state.billOfMaterialState
);

export const getBillOfMaterialLoaded = createSelector(
    getBillOfMaterialState,
    fromBillOfMaterial.getBillOfMaterialLoaded
);

export const getBillOfMaterialLoading = createSelector(
    getBillOfMaterialState,
    fromBillOfMaterial.getBillOfMaterialLoading
);

export const getCurrentBillOfMaterialsId = createSelector(
    getBillOfMaterialState,
    state => state.currentBillOfMaterialsId
);

export const getCurrentBillOfMaterial = createSelector(
    getBillOfMaterialState,
    getCurrentBillOfMaterialsId,
    (state, currentBillOfMaterialsId) => {
        if (currentBillOfMaterialsId === 0) {
            return {
                BillOfMaterialsId: 0,
                ProductAssemblyId: null,
                ProductAssemblyName: null,
                ComponentId: null,
                ComponentName: null,
                HorizontalQuantity: null,
                HorizontalFormula: null,
                VerticalQuantity: null,
                VerticalFormula: null,
                UnitMeasureId: null,
                UnitMeasureName: null
            };
        } else {
            return currentBillOfMaterialsId ? state.billOfMaterials.find(p => p.BillOfMaterialsId === currentBillOfMaterialsId) : null;
        }
    }
);

export const getBillOfMaterials = createSelector(
    getBillOfMaterialState,
    state => state.billOfMaterials
);

export const getBillOfMaterialsAll = createSelector(
    getBillOfMaterialState,
    state => state.billOfMaterialsAll
);

export const getBillOfMaterialCount = createSelector(
    getBillOfMaterialState,
    state => state.billOfMaterialCount
);

export const getBillOfMaterialDataSourceParameters = createSelector(
    getBillOfMaterialState,
    state => state.billOfMaterialDataSourceParameters
);

export const getBillOfMaterialActionSucceeded = createSelector(
    getBillOfMaterialState,
    fromBillOfMaterial.getBillOfMaterialActionSucceeded
);

export const getBillOfMaterialError = createSelector(
    getBillOfMaterialState,
    state => state.error
);
