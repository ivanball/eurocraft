import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as salesOrderHeaderActions from '../actions/salesorderheader.actions';
import { SalesOrderHeaderService } from '../../services/salesorderheader.service';
import { SalesOrderHeader } from '../../models/salesorderheader';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class SalesOrderHeaderEffects {

  constructor(
    private actions$: Actions,
    private salesOrderHeaderService: SalesOrderHeaderService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadSalesOrderHeaders$: Observable<Action> = this.actions$.pipe(
    ofType(salesOrderHeaderActions.SalesOrderHeaderActionTypes.LoadSalesOrderHeader),
    withLatestFrom(this.store$.select(selectors.getSalesOrderHeaderDataSourceParameters)),
    mergeMap(([action, salesOrderHeaderDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.salesOrderHeaderService.getSalesOrderHeaders2(salesOrderHeaderDataSourceParameters).pipe(
        map(salesOrderHeaders => (new salesOrderHeaderActions.LoadSalesOrderHeaderSuccess(salesOrderHeaders))),
        catchError(err => of(new salesOrderHeaderActions.LoadSalesOrderHeaderFail(err)))
      )
    )
  );

  @Effect()
  loadSalesOrderHeadersAll$: Observable<Action> = this.actions$.pipe(
    ofType(salesOrderHeaderActions.SalesOrderHeaderActionTypes.LoadSalesOrderHeaderAll),
    mergeMap((action: Action) =>
      this.salesOrderHeaderService.getSalesOrderHeaders().pipe(
        map(salesOrderHeaders => (new salesOrderHeaderActions.LoadSalesOrderHeaderAllSuccess(salesOrderHeaders))),
        catchError(err => of(new salesOrderHeaderActions.LoadSalesOrderHeaderAllFail(err)))
      )
    )
  );

  @Effect()
  createSalesOrderHeader$: Observable<Action> = this.actions$.pipe(
    ofType(salesOrderHeaderActions.SalesOrderHeaderActionTypes.CreateSalesOrderHeader),
    map((action: salesOrderHeaderActions.CreateSalesOrderHeader) => action.payload),
    mergeMap((salesOrderHeader: SalesOrderHeader) =>
      this.salesOrderHeaderService.createSalesOrderHeader(salesOrderHeader).pipe(
        map(newSalesOrderHeader => (new salesOrderHeaderActions.CreateSalesOrderHeaderSuccess(newSalesOrderHeader))),
        catchError(err => of(new salesOrderHeaderActions.CreateSalesOrderHeaderFail(err)))
      )
    )
  );

  @Effect()
  updateSalesOrderHeader$: Observable<Action> = this.actions$.pipe(
    ofType(salesOrderHeaderActions.SalesOrderHeaderActionTypes.UpdateSalesOrderHeader),
    map((action: salesOrderHeaderActions.UpdateSalesOrderHeader) => action.payload),
    mergeMap((salesOrderHeader: SalesOrderHeader) =>
      this.salesOrderHeaderService.updateSalesOrderHeader(salesOrderHeader).pipe(
        map(updatedSalesOrderHeader => (new salesOrderHeaderActions.UpdateSalesOrderHeaderSuccess(updatedSalesOrderHeader))),
        catchError(err => of(new salesOrderHeaderActions.UpdateSalesOrderHeaderFail(err)))
      )
    )
  );

  @Effect()
  deleteSalesOrderHeader$: Observable<Action> = this.actions$.pipe(
    ofType(salesOrderHeaderActions.SalesOrderHeaderActionTypes.DeleteSalesOrderHeader),
    map((action: salesOrderHeaderActions.DeleteSalesOrderHeader) => action.payload),
    mergeMap((salesOrderId: number) =>
      this.salesOrderHeaderService.deleteSalesOrderHeader(salesOrderId).pipe(
        map(() => (new salesOrderHeaderActions.DeleteSalesOrderHeaderSuccess(salesOrderId))),
        catchError(err => of(new salesOrderHeaderActions.DeleteSalesOrderHeaderFail(err)))
      )
    )
  );

  @Effect()
  handleSalesOrderHeaderSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      salesOrderHeaderActions.SalesOrderHeaderActionTypes.SetSalesOrderHeaderDataSourceParameters,
      salesOrderHeaderActions.SalesOrderHeaderActionTypes.CreateSalesOrderHeaderSuccess,
      salesOrderHeaderActions.SalesOrderHeaderActionTypes.UpdateSalesOrderHeaderSuccess,
      salesOrderHeaderActions.SalesOrderHeaderActionTypes.DeleteSalesOrderHeaderSuccess
    ),
    map(() => (new salesOrderHeaderActions.LoadSalesOrderHeader())
    ));

}
