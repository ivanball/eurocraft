import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers"
import * as fromSalesOrderHeader from "../reducers/salesorderheader.reducer";

export const getSalesOrderHeaderState = createSelector(
  fromFeature.getOrdersState,
  (state: fromFeature.OrdersState) => state.salesOrderHeaderState
);

export const getSalesOrderHeaderLoaded = createSelector(
  getSalesOrderHeaderState,
  fromSalesOrderHeader.getSalesOrderHeaderLoaded
);

export const getSalesOrderHeaderLoading = createSelector(
  getSalesOrderHeaderState,
  fromSalesOrderHeader.getSalesOrderHeaderLoading
);

export const getCurrentSalesOrderId = createSelector(
  getSalesOrderHeaderState,
  state => state.currentSalesOrderId
);

export const getCurrentSalesOrderHeader = createSelector(
  getSalesOrderHeaderState,
  getCurrentSalesOrderId,
  (state, currentSalesOrderId) => {
    if (currentSalesOrderId === 0) {
      return {
        SalesOrderId: 0,
        RevisionNumber: 0,
        SalesOrderNo: "",
        OrderDate: new Date(),
        DueDate: new Date(),
        ShipDate: null,
        Status: 0,
        DealerId: 0,
        SalesPersonId: null,
        BillToAddressId: null,
        ShipToAddressId: null,
        ShipMethodId: null,
        SubTotal: 0,
        TaxAmt: 0,
        Freight: 0,
        TotalDue: 0,
        Comment: "",

        DealerName: ""
      };
    } else {
      return currentSalesOrderId
        ? state.salesOrderHeaders.find(
            p => p.SalesOrderId === currentSalesOrderId
          )
        : null;
    }
  }
);

export const getSalesOrderHeaders = createSelector(
  getSalesOrderHeaderState,
  state => state.salesOrderHeaders
);

export const getSalesOrderHeadersAll = createSelector(
  getSalesOrderHeaderState,
  state => state.salesOrderHeadersAll
);

export const getSalesOrderHeaderCount = createSelector(
  getSalesOrderHeaderState,
  state => state.salesOrderHeaderCount
);

export const getSalesOrderHeaderDataSourceParameters = createSelector(
  getSalesOrderHeaderState,
  state => state.salesOrderHeaderDataSourceParameters
);

export const getSalesOrderHeaderActionSucceeded = createSelector(
  getSalesOrderHeaderState,
  fromSalesOrderHeader.getSalesOrderHeaderActionSucceeded
);

export const getSalesOrderHeaderError = createSelector(
  getSalesOrderHeaderState,
  state => state.error
);
