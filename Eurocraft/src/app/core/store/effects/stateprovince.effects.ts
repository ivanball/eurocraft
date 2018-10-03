import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as stateProvinceActions from '../actions/stateprovince.actions';
import { StateProvinceService } from '../../services/stateprovince.service';
import { StateProvince } from '../../models/stateprovince';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class StateProvinceEffects {

  constructor(
    private actions$: Actions,
    private stateProvinceService: StateProvinceService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadStateProvinces$: Observable<Action> = this.actions$.pipe(
    ofType(stateProvinceActions.StateProvinceActionTypes.LoadStateProvince),
    withLatestFrom(this.store$.select(selectors.getStateProvinceDataSourceParameters)),
    mergeMap(([action, stateProvinceDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.stateProvinceService.getStateProvinces2(stateProvinceDataSourceParameters).pipe(
        map(stateProvinces => (new stateProvinceActions.LoadStateProvinceSuccess(stateProvinces))),
        catchError(err => of(new stateProvinceActions.LoadStateProvinceFail(err)))
      )
    )
  );

  @Effect()
  loadStateProvincesAll$: Observable<Action> = this.actions$.pipe(
    ofType(stateProvinceActions.StateProvinceActionTypes.LoadStateProvinceAll),
    mergeMap((action: Action) =>
      this.stateProvinceService.getStateProvinces().pipe(
        map(stateProvinces => (new stateProvinceActions.LoadStateProvinceAllSuccess(stateProvinces))),
        catchError(err => of(new stateProvinceActions.LoadStateProvinceAllFail(err)))
      )
    )
  );

  @Effect()
  createStateProvince$: Observable<Action> = this.actions$.pipe(
    ofType(stateProvinceActions.StateProvinceActionTypes.CreateStateProvince),
    map((action: stateProvinceActions.CreateStateProvince) => action.payload),
    mergeMap((stateProvince: StateProvince) =>
      this.stateProvinceService.createStateProvince(stateProvince).pipe(
        map(newStateProvince => (new stateProvinceActions.CreateStateProvinceSuccess(newStateProvince))),
        catchError(err => of(new stateProvinceActions.CreateStateProvinceFail(err)))
      )
    )
  );

  @Effect()
  updateStateProvince$: Observable<Action> = this.actions$.pipe(
    ofType(stateProvinceActions.StateProvinceActionTypes.UpdateStateProvince),
    map((action: stateProvinceActions.UpdateStateProvince) => action.payload),
    mergeMap((stateProvince: StateProvince) =>
      this.stateProvinceService.updateStateProvince(stateProvince).pipe(
        map(updatedStateProvince => (new stateProvinceActions.UpdateStateProvinceSuccess(updatedStateProvince))),
        catchError(err => of(new stateProvinceActions.UpdateStateProvinceFail(err)))
      )
    )
  );

  @Effect()
  deleteStateProvince$: Observable<Action> = this.actions$.pipe(
    ofType(stateProvinceActions.StateProvinceActionTypes.DeleteStateProvince),
    map((action: stateProvinceActions.DeleteStateProvince) => action.payload),
    mergeMap((stateProvinceId: number) =>
      this.stateProvinceService.deleteStateProvince(stateProvinceId).pipe(
        map(() => (new stateProvinceActions.DeleteStateProvinceSuccess(stateProvinceId))),
        catchError(err => of(new stateProvinceActions.DeleteStateProvinceFail(err)))
      )
    )
  );

  @Effect()
  handleStateProvinceSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      stateProvinceActions.StateProvinceActionTypes.SetStateProvinceDataSourceParameters,
      stateProvinceActions.StateProvinceActionTypes.CreateStateProvinceSuccess,
      stateProvinceActions.StateProvinceActionTypes.UpdateStateProvinceSuccess,
      stateProvinceActions.StateProvinceActionTypes.DeleteStateProvinceSuccess
    ),
    map(() => (new stateProvinceActions.LoadStateProvince())
    ));

}
