import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as dealerTypeActions from '../actions/dealertype.actions';
import { DealerTypeService } from '../../services/dealertype.service';
import { DealerType } from '../../models/dealertype';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class DealerTypeEffects {

  constructor(
    private actions$: Actions,
    private dealerTypeService: DealerTypeService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadDealerTypes$: Observable<Action> = this.actions$.pipe(
    ofType(dealerTypeActions.DealerTypeActionTypes.LoadDealerType),
    withLatestFrom(this.store$.select(selectors.getDealerTypeDataSourceParameters)),
    mergeMap(([action, dealerTypeDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.dealerTypeService.getDealerTypes2(dealerTypeDataSourceParameters).pipe(
        map(dealerTypes => (new dealerTypeActions.LoadDealerTypeSuccess(dealerTypes))),
        catchError(err => of(new dealerTypeActions.LoadDealerTypeFail(err)))
      )
    )
  );

  @Effect()
  loadDealerTypesAll$: Observable<Action> = this.actions$.pipe(
    ofType(dealerTypeActions.DealerTypeActionTypes.LoadDealerTypeAll),
    mergeMap((action: Action) =>
      this.dealerTypeService.getDealerTypes().pipe(
        map(dealerTypes => (new dealerTypeActions.LoadDealerTypeAllSuccess(dealerTypes))),
        catchError(err => of(new dealerTypeActions.LoadDealerTypeAllFail(err)))
      )
    )
  );

  @Effect()
  createDealerType$: Observable<Action> = this.actions$.pipe(
    ofType(dealerTypeActions.DealerTypeActionTypes.CreateDealerType),
    map((action: dealerTypeActions.CreateDealerType) => action.payload),
    mergeMap((dealerType: DealerType) =>
      this.dealerTypeService.createDealerType(dealerType).pipe(
        map(newDealerType => (new dealerTypeActions.CreateDealerTypeSuccess(newDealerType))),
        catchError(err => of(new dealerTypeActions.CreateDealerTypeFail(err)))
      )
    )
  );

  @Effect()
  updateDealerType$: Observable<Action> = this.actions$.pipe(
    ofType(dealerTypeActions.DealerTypeActionTypes.UpdateDealerType),
    map((action: dealerTypeActions.UpdateDealerType) => action.payload),
    mergeMap((dealerType: DealerType) =>
      this.dealerTypeService.updateDealerType(dealerType).pipe(
        map(updatedDealerType => (new dealerTypeActions.UpdateDealerTypeSuccess(updatedDealerType))),
        catchError(err => of(new dealerTypeActions.UpdateDealerTypeFail(err)))
      )
    )
  );

  @Effect()
  deleteDealerType$: Observable<Action> = this.actions$.pipe(
    ofType(dealerTypeActions.DealerTypeActionTypes.DeleteDealerType),
    map((action: dealerTypeActions.DeleteDealerType) => action.payload),
    mergeMap((dealerTypeId: number) =>
      this.dealerTypeService.deleteDealerType(dealerTypeId).pipe(
        map(() => (new dealerTypeActions.DeleteDealerTypeSuccess(dealerTypeId))),
        catchError(err => of(new dealerTypeActions.DeleteDealerTypeFail(err)))
      )
    )
  );

  @Effect()
  handleDealerTypeSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      dealerTypeActions.DealerTypeActionTypes.SetDealerTypeDataSourceParameters,
      dealerTypeActions.DealerTypeActionTypes.CreateDealerTypeSuccess,
      dealerTypeActions.DealerTypeActionTypes.UpdateDealerTypeSuccess,
      dealerTypeActions.DealerTypeActionTypes.DeleteDealerTypeSuccess
    ),
    map(() => (new dealerTypeActions.LoadDealerType())
    ));

}
