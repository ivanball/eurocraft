import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as addressTypeActions from '../actions/addresstype.actions';
import { AddressTypeService } from '../../services/addresstype.service';
import { AddressType } from '../../models/addresstype';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class AddressTypeEffects {

  constructor(
    private actions$: Actions,
    private addressTypeService: AddressTypeService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadAddressTypes$: Observable<Action> = this.actions$.pipe(
    ofType(addressTypeActions.AddressTypeActionTypes.LoadAddressType),
    withLatestFrom(this.store$.select(selectors.getAddressTypeDataSourceParameters)),
    mergeMap(([action, addressTypeDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.addressTypeService.getAddressTypes2(addressTypeDataSourceParameters).pipe(
        map(addressTypes => (new addressTypeActions.LoadAddressTypeSuccess(addressTypes))),
        catchError(err => of(new addressTypeActions.LoadAddressTypeFail(err)))
      )
    )
  );

  @Effect()
  loadAddressTypesAll$: Observable<Action> = this.actions$.pipe(
    ofType(addressTypeActions.AddressTypeActionTypes.LoadAddressTypeAll),
    mergeMap((action: Action) =>
      this.addressTypeService.getAddressTypes().pipe(
        map(addressTypes => (new addressTypeActions.LoadAddressTypeAllSuccess(addressTypes))),
        catchError(err => of(new addressTypeActions.LoadAddressTypeAllFail(err)))
      )
    )
  );

  @Effect()
  createAddressType$: Observable<Action> = this.actions$.pipe(
    ofType(addressTypeActions.AddressTypeActionTypes.CreateAddressType),
    map((action: addressTypeActions.CreateAddressType) => action.payload),
    mergeMap((addressType: AddressType) =>
      this.addressTypeService.createAddressType(addressType).pipe(
        map(newAddressType => (new addressTypeActions.CreateAddressTypeSuccess(newAddressType))),
        catchError(err => of(new addressTypeActions.CreateAddressTypeFail(err)))
      )
    )
  );

  @Effect()
  updateAddressType$: Observable<Action> = this.actions$.pipe(
    ofType(addressTypeActions.AddressTypeActionTypes.UpdateAddressType),
    map((action: addressTypeActions.UpdateAddressType) => action.payload),
    mergeMap((addressType: AddressType) =>
      this.addressTypeService.updateAddressType(addressType).pipe(
        map(updatedAddressType => (new addressTypeActions.UpdateAddressTypeSuccess(updatedAddressType))),
        catchError(err => of(new addressTypeActions.UpdateAddressTypeFail(err)))
      )
    )
  );

  @Effect()
  deleteAddressType$: Observable<Action> = this.actions$.pipe(
    ofType(addressTypeActions.AddressTypeActionTypes.DeleteAddressType),
    map((action: addressTypeActions.DeleteAddressType) => action.payload),
    mergeMap((addressTypeId: number) =>
      this.addressTypeService.deleteAddressType(addressTypeId).pipe(
        map(() => (new addressTypeActions.DeleteAddressTypeSuccess(addressTypeId))),
        catchError(err => of(new addressTypeActions.DeleteAddressTypeFail(err)))
      )
    )
  );

  @Effect()
  handleAddressTypeSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      addressTypeActions.AddressTypeActionTypes.SetAddressTypeDataSourceParameters,
      addressTypeActions.AddressTypeActionTypes.CreateAddressTypeSuccess,
      addressTypeActions.AddressTypeActionTypes.UpdateAddressTypeSuccess,
      addressTypeActions.AddressTypeActionTypes.DeleteAddressTypeSuccess
    ),
    map(() => (new addressTypeActions.LoadAddressType())
    ));

}
