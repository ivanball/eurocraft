import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as salesOrderDetailActions from '../actions/salesorderdetail.actions';
import { SalesOrderDetailService } from '../../services/salesorderdetail.service';
import { SalesOrderDetail } from '../../models/salesorderdetail';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class SalesOrderDetailEffects {

  constructor(
    private actions$: Actions,
    private salesOrderDetailService: SalesOrderDetailService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadSalesOrderDetails$: Observable<Action> = this.actions$.pipe(
    ofType(salesOrderDetailActions.SalesOrderDetailActionTypes.LoadSalesOrderDetail),
    withLatestFrom(this.store$.select(selectors.getSalesOrderDetailDataSourceParameters)),
    mergeMap(([action, salesOrderDetailDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.salesOrderDetailService.getSalesOrderDetails2(salesOrderDetailDataSourceParameters).pipe(
        map(salesOrderDetails => (new salesOrderDetailActions.LoadSalesOrderDetailSuccess(salesOrderDetails))),
        catchError(err => of(new salesOrderDetailActions.LoadSalesOrderDetailFail(err)))
      )
    )
  );

  @Effect()
  loadSalesOrderDetailsAll$: Observable<Action> = this.actions$.pipe(
    ofType(salesOrderDetailActions.SalesOrderDetailActionTypes.LoadSalesOrderDetailAll),
    mergeMap((action: Action) =>
      this.salesOrderDetailService.getSalesOrderDetails().pipe(
        map(salesOrderDetails => (new salesOrderDetailActions.LoadSalesOrderDetailAllSuccess(salesOrderDetails))),
        catchError(err => of(new salesOrderDetailActions.LoadSalesOrderDetailAllFail(err)))
      )
    )
  );

  @Effect()
  createSalesOrderDetail$: Observable<Action> = this.actions$.pipe(
    ofType(salesOrderDetailActions.SalesOrderDetailActionTypes.CreateSalesOrderDetail),
    map((action: salesOrderDetailActions.CreateSalesOrderDetail) => action.payload),
    mergeMap((salesOrderDetail: SalesOrderDetail) =>
      this.salesOrderDetailService.createSalesOrderDetail(salesOrderDetail).pipe(
        map(newSalesOrderDetail => (new salesOrderDetailActions.CreateSalesOrderDetailSuccess(newSalesOrderDetail))),
        catchError(err => of(new salesOrderDetailActions.CreateSalesOrderDetailFail(err)))
      )
    )
  );

  @Effect()
  updateSalesOrderDetail$: Observable<Action> = this.actions$.pipe(
    ofType(salesOrderDetailActions.SalesOrderDetailActionTypes.UpdateSalesOrderDetail),
    map((action: salesOrderDetailActions.UpdateSalesOrderDetail) => action.payload),
    mergeMap((salesOrderDetail: SalesOrderDetail) =>
      this.salesOrderDetailService.updateSalesOrderDetail(salesOrderDetail).pipe(
        map(updatedSalesOrderDetail => (new salesOrderDetailActions.UpdateSalesOrderDetailSuccess(updatedSalesOrderDetail))),
        catchError(err => of(new salesOrderDetailActions.UpdateSalesOrderDetailFail(err)))
      )
    )
  );

  @Effect()
  deleteSalesOrderDetail$: Observable<Action> = this.actions$.pipe(
    ofType(salesOrderDetailActions.SalesOrderDetailActionTypes.DeleteSalesOrderDetail),
    map((action: salesOrderDetailActions.DeleteSalesOrderDetail) => action.payload),
    mergeMap((salesOrderDetailId: number) =>
      this.salesOrderDetailService.deleteSalesOrderDetail(salesOrderDetailId).pipe(
        map(() => (new salesOrderDetailActions.DeleteSalesOrderDetailSuccess(salesOrderDetailId))),
        catchError(err => of(new salesOrderDetailActions.DeleteSalesOrderDetailFail(err)))
      )
    )
  );

  @Effect()
  handleSalesOrderDetailSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      salesOrderDetailActions.SalesOrderDetailActionTypes.SetSalesOrderDetailDataSourceParameters,
      salesOrderDetailActions.SalesOrderDetailActionTypes.CreateSalesOrderDetailSuccess,
      salesOrderDetailActions.SalesOrderDetailActionTypes.UpdateSalesOrderDetailSuccess,
      salesOrderDetailActions.SalesOrderDetailActionTypes.DeleteSalesOrderDetailSuccess
    ),
    map(() => (new salesOrderDetailActions.LoadSalesOrderDetail())
    ));

}
