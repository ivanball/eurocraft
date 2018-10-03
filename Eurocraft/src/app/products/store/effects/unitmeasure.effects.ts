import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as unitMeasureActions from '../actions/unitmeasure.actions';
import { UnitMeasureService } from '../../services/unitmeasure.service';
import { UnitMeasure } from '../../models/unitmeasure';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class UnitMeasureEffects {

  constructor(
    private actions$: Actions,
    private unitMeasureService: UnitMeasureService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadUnitMeasures$: Observable<Action> = this.actions$.pipe(
    ofType(unitMeasureActions.UnitMeasureActionTypes.LoadUnitMeasure),
    withLatestFrom(this.store$.select(selectors.getUnitMeasureDataSourceParameters)),
    mergeMap(([action, unitMeasureDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.unitMeasureService.getUnitMeasures2(unitMeasureDataSourceParameters).pipe(
        map(unitMeasures => (new unitMeasureActions.LoadUnitMeasureSuccess(unitMeasures))),
        catchError(err => of(new unitMeasureActions.LoadUnitMeasureFail(err)))
      )
    )
  );

  @Effect()
  loadUnitMeasuresAll$: Observable<Action> = this.actions$.pipe(
    ofType(unitMeasureActions.UnitMeasureActionTypes.LoadUnitMeasureAll),
    mergeMap((action: Action) =>
      this.unitMeasureService.getUnitMeasures().pipe(
        map(unitMeasures => (new unitMeasureActions.LoadUnitMeasureAllSuccess(unitMeasures))),
        catchError(err => of(new unitMeasureActions.LoadUnitMeasureAllFail(err)))
      )
    )
  );

  @Effect()
  createUnitMeasure$: Observable<Action> = this.actions$.pipe(
    ofType(unitMeasureActions.UnitMeasureActionTypes.CreateUnitMeasure),
    map((action: unitMeasureActions.CreateUnitMeasure) => action.payload),
    mergeMap((unitMeasure: UnitMeasure) =>
      this.unitMeasureService.createUnitMeasure(unitMeasure).pipe(
        map(newUnitMeasure => (new unitMeasureActions.CreateUnitMeasureSuccess(newUnitMeasure))),
        catchError(err => of(new unitMeasureActions.CreateUnitMeasureFail(err)))
      )
    )
  );

  @Effect()
  updateUnitMeasure$: Observable<Action> = this.actions$.pipe(
    ofType(unitMeasureActions.UnitMeasureActionTypes.UpdateUnitMeasure),
    map((action: unitMeasureActions.UpdateUnitMeasure) => action.payload),
    mergeMap((unitMeasure: UnitMeasure) =>
      this.unitMeasureService.updateUnitMeasure(unitMeasure).pipe(
        map(updatedUnitMeasure => (new unitMeasureActions.UpdateUnitMeasureSuccess(updatedUnitMeasure))),
        catchError(err => of(new unitMeasureActions.UpdateUnitMeasureFail(err)))
      )
    )
  );

  @Effect()
  deleteUnitMeasure$: Observable<Action> = this.actions$.pipe(
    ofType(unitMeasureActions.UnitMeasureActionTypes.DeleteUnitMeasure),
    map((action: unitMeasureActions.DeleteUnitMeasure) => action.payload),
    mergeMap((unitMeasureId: number) =>
      this.unitMeasureService.deleteUnitMeasure(unitMeasureId).pipe(
        map(() => (new unitMeasureActions.DeleteUnitMeasureSuccess(unitMeasureId))),
        catchError(err => of(new unitMeasureActions.DeleteUnitMeasureFail(err)))
      )
    )
  );

  @Effect()
  handleUnitMeasureSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      unitMeasureActions.UnitMeasureActionTypes.SetUnitMeasureDataSourceParameters,
      unitMeasureActions.UnitMeasureActionTypes.CreateUnitMeasureSuccess,
      unitMeasureActions.UnitMeasureActionTypes.UpdateUnitMeasureSuccess,
      unitMeasureActions.UnitMeasureActionTypes.DeleteUnitMeasureSuccess
    ),
    map(() => (new unitMeasureActions.LoadUnitMeasure())
    ));

}
