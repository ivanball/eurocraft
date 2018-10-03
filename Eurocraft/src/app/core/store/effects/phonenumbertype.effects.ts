import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as phoneNumberTypeActions from '../actions/phonenumbertype.actions';
import { PhoneNumberTypeService } from '../../services/phonenumbertype.service';
import { PhoneNumberType } from '../../models/phonenumbertype';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class PhoneNumberTypeEffects {

  constructor(
    private actions$: Actions,
    private phoneNumberTypeService: PhoneNumberTypeService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadPhoneNumberTypes$: Observable<Action> = this.actions$.pipe(
    ofType(phoneNumberTypeActions.PhoneNumberTypeActionTypes.LoadPhoneNumberType),
    withLatestFrom(this.store$.select(selectors.getPhoneNumberTypeDataSourceParameters)),
    mergeMap(([action, phoneNumberTypeDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.phoneNumberTypeService.getPhoneNumberTypes2(phoneNumberTypeDataSourceParameters).pipe(
        map(phoneNumberTypes => (new phoneNumberTypeActions.LoadPhoneNumberTypeSuccess(phoneNumberTypes))),
        catchError(err => of(new phoneNumberTypeActions.LoadPhoneNumberTypeFail(err)))
      )
    )
  );

  @Effect()
  loadPhoneNumberTypesAll$: Observable<Action> = this.actions$.pipe(
    ofType(phoneNumberTypeActions.PhoneNumberTypeActionTypes.LoadPhoneNumberTypeAll),
    mergeMap((action: Action) =>
      this.phoneNumberTypeService.getPhoneNumberTypes().pipe(
        map(phoneNumberTypes => (new phoneNumberTypeActions.LoadPhoneNumberTypeAllSuccess(phoneNumberTypes))),
        catchError(err => of(new phoneNumberTypeActions.LoadPhoneNumberTypeAllFail(err)))
      )
    )
  );

  @Effect()
  createPhoneNumberType$: Observable<Action> = this.actions$.pipe(
    ofType(phoneNumberTypeActions.PhoneNumberTypeActionTypes.CreatePhoneNumberType),
    map((action: phoneNumberTypeActions.CreatePhoneNumberType) => action.payload),
    mergeMap((phoneNumberType: PhoneNumberType) =>
      this.phoneNumberTypeService.createPhoneNumberType(phoneNumberType).pipe(
        map(newPhoneNumberType => (new phoneNumberTypeActions.CreatePhoneNumberTypeSuccess(newPhoneNumberType))),
        catchError(err => of(new phoneNumberTypeActions.CreatePhoneNumberTypeFail(err)))
      )
    )
  );

  @Effect()
  updatePhoneNumberType$: Observable<Action> = this.actions$.pipe(
    ofType(phoneNumberTypeActions.PhoneNumberTypeActionTypes.UpdatePhoneNumberType),
    map((action: phoneNumberTypeActions.UpdatePhoneNumberType) => action.payload),
    mergeMap((phoneNumberType: PhoneNumberType) =>
      this.phoneNumberTypeService.updatePhoneNumberType(phoneNumberType).pipe(
        map(updatedPhoneNumberType => (new phoneNumberTypeActions.UpdatePhoneNumberTypeSuccess(updatedPhoneNumberType))),
        catchError(err => of(new phoneNumberTypeActions.UpdatePhoneNumberTypeFail(err)))
      )
    )
  );

  @Effect()
  deletePhoneNumberType$: Observable<Action> = this.actions$.pipe(
    ofType(phoneNumberTypeActions.PhoneNumberTypeActionTypes.DeletePhoneNumberType),
    map((action: phoneNumberTypeActions.DeletePhoneNumberType) => action.payload),
    mergeMap((phoneNumberTypeId: number) =>
      this.phoneNumberTypeService.deletePhoneNumberType(phoneNumberTypeId).pipe(
        map(() => (new phoneNumberTypeActions.DeletePhoneNumberTypeSuccess(phoneNumberTypeId))),
        catchError(err => of(new phoneNumberTypeActions.DeletePhoneNumberTypeFail(err)))
      )
    )
  );

  @Effect()
  handlePhoneNumberTypeSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      phoneNumberTypeActions.PhoneNumberTypeActionTypes.SetPhoneNumberTypeDataSourceParameters,
      phoneNumberTypeActions.PhoneNumberTypeActionTypes.CreatePhoneNumberTypeSuccess,
      phoneNumberTypeActions.PhoneNumberTypeActionTypes.UpdatePhoneNumberTypeSuccess,
      phoneNumberTypeActions.PhoneNumberTypeActionTypes.DeletePhoneNumberTypeSuccess
    ),
    map(() => (new phoneNumberTypeActions.LoadPhoneNumberType())
    ));

}
