import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as vendorActions from '../actions/vendor.actions';
import { VendorService } from '../../services/vendor.service';
import { Vendor } from '../../models/vendor';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class VendorEffects {

  constructor(
    private actions$: Actions,
    private vendorService: VendorService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadVendors$: Observable<Action> = this.actions$.pipe(
    ofType(vendorActions.VendorActionTypes.LoadVendor),
    withLatestFrom(this.store$.select(selectors.getVendorDataSourceParameters)),
    mergeMap(([action, vendorDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.vendorService.getVendors2(vendorDataSourceParameters).pipe(
        map(vendors => (new vendorActions.LoadVendorSuccess(vendors))),
        catchError(err => of(new vendorActions.LoadVendorFail(err)))
      )
    )
  );

  @Effect()
  loadVendorsAll$: Observable<Action> = this.actions$.pipe(
    ofType(vendorActions.VendorActionTypes.LoadVendorAll),
    mergeMap((action: Action) =>
      this.vendorService.getVendors().pipe(
        map(vendors => (new vendorActions.LoadVendorAllSuccess(vendors))),
        catchError(err => of(new vendorActions.LoadVendorAllFail(err)))
      )
    )
  );

  @Effect()
  createVendor$: Observable<Action> = this.actions$.pipe(
    ofType(vendorActions.VendorActionTypes.CreateVendor),
    map((action: vendorActions.CreateVendor) => action.payload),
    mergeMap((vendor: Vendor) =>
      this.vendorService.createVendor(vendor).pipe(
        map(newVendor => (new vendorActions.CreateVendorSuccess(newVendor))),
        catchError(err => of(new vendorActions.CreateVendorFail(err)))
      )
    )
  );

  @Effect()
  updateVendor$: Observable<Action> = this.actions$.pipe(
    ofType(vendorActions.VendorActionTypes.UpdateVendor),
    map((action: vendorActions.UpdateVendor) => action.payload),
    mergeMap((vendor: Vendor) =>
      this.vendorService.updateVendor(vendor).pipe(
        map(updatedVendor => (new vendorActions.UpdateVendorSuccess(updatedVendor))),
        catchError(err => of(new vendorActions.UpdateVendorFail(err)))
      )
    )
  );

  @Effect()
  deleteVendor$: Observable<Action> = this.actions$.pipe(
    ofType(vendorActions.VendorActionTypes.DeleteVendor),
    map((action: vendorActions.DeleteVendor) => action.payload),
    mergeMap((vendorId: number) =>
      this.vendorService.deleteVendor(vendorId).pipe(
        map(() => (new vendorActions.DeleteVendorSuccess(vendorId))),
        catchError(err => of(new vendorActions.DeleteVendorFail(err)))
      )
    )
  );

  @Effect()
  handleVendorSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      vendorActions.VendorActionTypes.SetVendorDataSourceParameters,
      vendorActions.VendorActionTypes.CreateVendorSuccess,
      vendorActions.VendorActionTypes.UpdateVendorSuccess,
      vendorActions.VendorActionTypes.DeleteVendorSuccess
    ),
    map(() => (new vendorActions.LoadVendor())
    ));

}
