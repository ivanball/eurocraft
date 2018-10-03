import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as countryRegionActions from '../actions/countryregion.actions';
import { CountryRegionService } from '../../services/countryregion.service';
import { CountryRegion } from '../../models/countryregion';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class CountryRegionEffects {

  constructor(
    private actions$: Actions,
    private countryRegionService: CountryRegionService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadCountryRegions$: Observable<Action> = this.actions$.pipe(
    ofType(countryRegionActions.CountryRegionActionTypes.LoadCountryRegion),
    withLatestFrom(this.store$.select(selectors.getCountryRegionDataSourceParameters)),
    mergeMap(([action, countryRegionDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.countryRegionService.getCountryRegions2(countryRegionDataSourceParameters).pipe(
        map(countryRegions => (new countryRegionActions.LoadCountryRegionSuccess(countryRegions))),
        catchError(err => of(new countryRegionActions.LoadCountryRegionFail(err)))
      )
    )
  );

  @Effect()
  loadCountryRegionsAll$: Observable<Action> = this.actions$.pipe(
    ofType(countryRegionActions.CountryRegionActionTypes.LoadCountryRegionAll),
    mergeMap((action: Action) =>
      this.countryRegionService.getCountryRegions().pipe(
        map(countryRegions => (new countryRegionActions.LoadCountryRegionAllSuccess(countryRegions))),
        catchError(err => of(new countryRegionActions.LoadCountryRegionAllFail(err)))
      )
    )
  );

  @Effect()
  createCountryRegion$: Observable<Action> = this.actions$.pipe(
    ofType(countryRegionActions.CountryRegionActionTypes.CreateCountryRegion),
    map((action: countryRegionActions.CreateCountryRegion) => action.payload),
    mergeMap((countryRegion: CountryRegion) =>
      this.countryRegionService.createCountryRegion(countryRegion).pipe(
        map(newCountryRegion => (new countryRegionActions.CreateCountryRegionSuccess(newCountryRegion))),
        catchError(err => of(new countryRegionActions.CreateCountryRegionFail(err)))
      )
    )
  );

  @Effect()
  updateCountryRegion$: Observable<Action> = this.actions$.pipe(
    ofType(countryRegionActions.CountryRegionActionTypes.UpdateCountryRegion),
    map((action: countryRegionActions.UpdateCountryRegion) => action.payload),
    mergeMap((countryRegion: CountryRegion) =>
      this.countryRegionService.updateCountryRegion(countryRegion).pipe(
        map(updatedCountryRegion => (new countryRegionActions.UpdateCountryRegionSuccess(updatedCountryRegion))),
        catchError(err => of(new countryRegionActions.UpdateCountryRegionFail(err)))
      )
    )
  );

  @Effect()
  deleteCountryRegion$: Observable<Action> = this.actions$.pipe(
    ofType(countryRegionActions.CountryRegionActionTypes.DeleteCountryRegion),
    map((action: countryRegionActions.DeleteCountryRegion) => action.payload),
    mergeMap((countryRegionId: number) =>
      this.countryRegionService.deleteCountryRegion(countryRegionId).pipe(
        map(() => (new countryRegionActions.DeleteCountryRegionSuccess(countryRegionId))),
        catchError(err => of(new countryRegionActions.DeleteCountryRegionFail(err)))
      )
    )
  );

  @Effect()
  handleCountryRegionSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      countryRegionActions.CountryRegionActionTypes.SetCountryRegionDataSourceParameters,
      countryRegionActions.CountryRegionActionTypes.CreateCountryRegionSuccess,
      countryRegionActions.CountryRegionActionTypes.UpdateCountryRegionSuccess,
      countryRegionActions.CountryRegionActionTypes.DeleteCountryRegionSuccess
    ),
    map(() => (new countryRegionActions.LoadCountryRegion())
    ));

}
