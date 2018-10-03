import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as billOfMaterialActions from '../actions/billofmaterial.actions';
import { BillOfMaterialService } from '../../services/billofmaterial.service';
import { BillOfMaterial } from '../../models/billofmaterial';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class BillOfMaterialEffects {

  constructor(
    private actions$: Actions,
    private billOfMaterialService: BillOfMaterialService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadBillOfMaterials$: Observable<Action> = this.actions$.pipe(
    ofType(billOfMaterialActions.BillOfMaterialActionTypes.LoadBillOfMaterial),
    withLatestFrom(this.store$.select(selectors.getBillOfMaterialDataSourceParameters)),
    mergeMap(([action, billOfMaterialDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.billOfMaterialService.getBillOfMaterials2(billOfMaterialDataSourceParameters).pipe(
        map(billOfMaterials => (new billOfMaterialActions.LoadBillOfMaterialSuccess(billOfMaterials))),
        catchError(err => of(new billOfMaterialActions.LoadBillOfMaterialFail(err)))
      )
    )
  );

  @Effect()
  loadBillOfMaterialsAll$: Observable<Action> = this.actions$.pipe(
    ofType(billOfMaterialActions.BillOfMaterialActionTypes.LoadBillOfMaterialAll),
    mergeMap((action: Action) =>
      this.billOfMaterialService.getBillOfMaterials().pipe(
        map(billOfMaterials => (new billOfMaterialActions.LoadBillOfMaterialAllSuccess(billOfMaterials))),
        catchError(err => of(new billOfMaterialActions.LoadBillOfMaterialAllFail(err)))
      )
    )
  );

  @Effect()
  createBillOfMaterial$: Observable<Action> = this.actions$.pipe(
    ofType(billOfMaterialActions.BillOfMaterialActionTypes.CreateBillOfMaterial),
    map((action: billOfMaterialActions.CreateBillOfMaterial) => action.payload),
    mergeMap((billOfMaterial: BillOfMaterial) =>
      this.billOfMaterialService.createBillOfMaterial(billOfMaterial).pipe(
        map(newBillOfMaterial => (new billOfMaterialActions.CreateBillOfMaterialSuccess(newBillOfMaterial))),
        catchError(err => of(new billOfMaterialActions.CreateBillOfMaterialFail(err)))
      )
    )
  );

  @Effect()
  updateBillOfMaterial$: Observable<Action> = this.actions$.pipe(
    ofType(billOfMaterialActions.BillOfMaterialActionTypes.UpdateBillOfMaterial),
    map((action: billOfMaterialActions.UpdateBillOfMaterial) => action.payload),
    mergeMap((billOfMaterial: BillOfMaterial) =>
      this.billOfMaterialService.updateBillOfMaterial(billOfMaterial).pipe(
        map(updatedBillOfMaterial => (new billOfMaterialActions.UpdateBillOfMaterialSuccess(updatedBillOfMaterial))),
        catchError(err => of(new billOfMaterialActions.UpdateBillOfMaterialFail(err)))
      )
    )
  );

  @Effect()
  deleteBillOfMaterial$: Observable<Action> = this.actions$.pipe(
    ofType(billOfMaterialActions.BillOfMaterialActionTypes.DeleteBillOfMaterial),
    map((action: billOfMaterialActions.DeleteBillOfMaterial) => action.payload),
    mergeMap((billOfMaterialsId: number) =>
      this.billOfMaterialService.deleteBillOfMaterial(billOfMaterialsId).pipe(
        map(() => (new billOfMaterialActions.DeleteBillOfMaterialSuccess(billOfMaterialsId))),
        catchError(err => of(new billOfMaterialActions.DeleteBillOfMaterialFail(err)))
      )
    )
  );

  @Effect()
  handleBillOfMaterialSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      billOfMaterialActions.BillOfMaterialActionTypes.SetBillOfMaterialDataSourceParameters,
      billOfMaterialActions.BillOfMaterialActionTypes.CreateBillOfMaterialSuccess,
      billOfMaterialActions.BillOfMaterialActionTypes.UpdateBillOfMaterialSuccess,
      billOfMaterialActions.BillOfMaterialActionTypes.DeleteBillOfMaterialSuccess
    ),
    map(() => (new billOfMaterialActions.LoadBillOfMaterial())
    ));

}
