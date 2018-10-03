import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from '../../../app.state';
import * as fromSalesOrderDetail from './salesorderdetail.reducer';
import * as fromSalesOrderHeader from './salesorderheader.reducer';

export interface State extends fromRoot.State {
    ordersState: OrdersState;
}

export interface OrdersState {
    salesOrderDetailState: fromSalesOrderDetail.SalesOrderDetailState;
    salesOrderHeaderState: fromSalesOrderHeader.SalesOrderHeaderState;
}

export const reducers: ActionReducerMap<OrdersState> = {
    salesOrderDetailState: fromSalesOrderDetail.reducer,
    salesOrderHeaderState: fromSalesOrderHeader.reducer
}

export const getOrdersState = createFeatureSelector<OrdersState>('orders');
