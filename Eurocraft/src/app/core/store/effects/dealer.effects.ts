import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as dealerActions from '../actions/dealer.actions';
import { DealerService } from '../../services/dealer.service';
import { Dealer } from '../../models/dealer';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class DealerEffects {

  constructor(
    private actions$: Actions,
    private dealerService: DealerService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadDealers$: Observable<Action> = this.actions$.pipe(
    ofType(dealerActions.DealerActionTypes.LoadDealer),
    withLatestFrom(this.store$.select(selectors.getDealerDataSourceParameters)),
    mergeMap(([action, dealerDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.dealerService.getDealers2(dealerDataSourceParameters).pipe(
        map(dealers => (new dealerActions.LoadDealerSuccess(dealers))),
        catchError(err => of(new dealerActions.LoadDealerFail(err)))
      )
    )
  );

  @Effect()
  loadDealersAll$: Observable<Action> = this.actions$.pipe(
    ofType(dealerActions.DealerActionTypes.LoadDealerAll),
    mergeMap((action: Action) =>
      this.dealerService.getDealers().pipe(
        map(dealers => (new dealerActions.LoadDealerAllSuccess(dealers))),
        catchError(err => of(new dealerActions.LoadDealerAllFail(err)))
      )
    )
  );

  @Effect()
  createDealer$: Observable<Action> = this.actions$.pipe(
    ofType(dealerActions.DealerActionTypes.CreateDealer),
    map((action: dealerActions.CreateDealer) => action.payload),
    mergeMap((dealer: Dealer) =>
      this.dealerService.createDealer(dealer).pipe(
        map(newDealer => (new dealerActions.CreateDealerSuccess(newDealer))),
        catchError(err => of(new dealerActions.CreateDealerFail(err)))
      )
    )
  );

  @Effect()
  updateDealer$: Observable<Action> = this.actions$.pipe(
    ofType(dealerActions.DealerActionTypes.UpdateDealer),
    map((action: dealerActions.UpdateDealer) => action.payload),
    mergeMap((dealer: Dealer) =>
      this.dealerService.updateDealer(dealer).pipe(
        map(updatedDealer => (new dealerActions.UpdateDealerSuccess(updatedDealer))),
        catchError(err => of(new dealerActions.UpdateDealerFail(err)))
      )
    )
  );

  @Effect()
  deleteDealer$: Observable<Action> = this.actions$.pipe(
    ofType(dealerActions.DealerActionTypes.DeleteDealer),
    map((action: dealerActions.DeleteDealer) => action.payload),
    mergeMap((dealerId: number) =>
      this.dealerService.deleteDealer(dealerId).pipe(
        map(() => (new dealerActions.DeleteDealerSuccess(dealerId))),
        catchError(err => of(new dealerActions.DeleteDealerFail(err)))
      )
    )
  );

  @Effect()
  handleDealerSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      dealerActions.DealerActionTypes.SetDealerDataSourceParameters,
      dealerActions.DealerActionTypes.CreateDealerSuccess,
      dealerActions.DealerActionTypes.UpdateDealerSuccess,
      dealerActions.DealerActionTypes.DeleteDealerSuccess
    ),
    map(() => (new dealerActions.LoadDealer())
    ));

}
