import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromSalesOrderDetail from "../reducers/salesorderdetail.reducer";

export const getSalesOrderDetailState = createSelector(
  fromFeature.getOrdersState,
  (state: fromFeature.OrdersState) => state.salesOrderDetailState
);

export const getSalesOrderDetailLoaded = createSelector(
  getSalesOrderDetailState,
  fromSalesOrderDetail.getSalesOrderDetailLoaded
);

export const getSalesOrderDetailLoading = createSelector(
  getSalesOrderDetailState,
  fromSalesOrderDetail.getSalesOrderDetailLoading
);

export const getCurrentSalesOrderDetailId = createSelector(
  getSalesOrderDetailState,
  state => state.currentSalesOrderDetailId
);

export const getCurrentSalesOrderDetail = createSelector(
  getSalesOrderDetailState,
  getCurrentSalesOrderDetailId,
  (state, currentSalesOrderDetailId) => {
    if (currentSalesOrderDetailId === 0) {
      return {
        SalesOrderDetailId: 0,
        SalesOrderId: 0,
        OrderQty: 0,
        ProductId: 0,
        HorizontalSize: null,
        VerticalSize: null,
        UnitMeasureId: null,
        UnitPrice: 0,
        UnitPriceDiscount: 0,
        LineTotal: 0,
        Glazing: "",
        HandleColor: "",
        Color: "",
        CarrierTrackingNumber: "",

        ProductName: ""
      };
    } else {
      return currentSalesOrderDetailId
        ? state.salesOrderDetails.find(
            p => p.SalesOrderDetailId === currentSalesOrderDetailId
          )
        : null;
    }
  }
);

export const getSalesOrderDetails = createSelector(
  getSalesOrderDetailState,
  state => state.salesOrderDetails
);

export const getSalesOrderDetailsAll = createSelector(
  getSalesOrderDetailState,
  state => state.salesOrderDetailsAll
);

export const getSalesOrderDetailCount = createSelector(
  getSalesOrderDetailState,
  state => state.salesOrderDetailCount
);

export const getSalesOrderDetailDataSourceParameters = createSelector(
  getSalesOrderDetailState,
  state => state.salesOrderDetailDataSourceParameters
);

export const getSalesOrderDetailActionSucceeded = createSelector(
  getSalesOrderDetailState,
  fromSalesOrderDetail.getSalesOrderDetailActionSucceeded
);

export const getSalesOrderDetailError = createSelector(
  getSalesOrderDetailState,
  state => state.error
);
