import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as productMaterialActions from '../actions/productmaterial.actions';
import { ProductMaterialService } from '../../services/productmaterial.service';
import { ProductMaterial } from '../../models/productmaterial';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class ProductMaterialEffects {

  constructor(
    private actions$: Actions,
    private productMaterialService: ProductMaterialService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadProductMaterials$: Observable<Action> = this.actions$.pipe(
    ofType(productMaterialActions.ProductMaterialActionTypes.LoadProductMaterial),
    withLatestFrom(this.store$.select(selectors.getProductMaterialDataSourceParameters)),
    mergeMap(([action, productMaterialDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.productMaterialService.getProductMaterials2(productMaterialDataSourceParameters).pipe(
        map(productMaterials => (new productMaterialActions.LoadProductMaterialSuccess(productMaterials))),
        catchError(err => of(new productMaterialActions.LoadProductMaterialFail(err)))
      )
    )
  );

  @Effect()
  loadProductMaterialsAll$: Observable<Action> = this.actions$.pipe(
    ofType(productMaterialActions.ProductMaterialActionTypes.LoadProductMaterialAll),
    mergeMap((action: Action) =>
      this.productMaterialService.getProductMaterials().pipe(
        map(productMaterials => (new productMaterialActions.LoadProductMaterialAllSuccess(productMaterials))),
        catchError(err => of(new productMaterialActions.LoadProductMaterialAllFail(err)))
      )
    )
  );

  @Effect()
  createProductMaterial$: Observable<Action> = this.actions$.pipe(
    ofType(productMaterialActions.ProductMaterialActionTypes.CreateProductMaterial),
    map((action: productMaterialActions.CreateProductMaterial) => action.payload),
    mergeMap((productMaterial: ProductMaterial) =>
      this.productMaterialService.createProductMaterial(productMaterial).pipe(
        map(newProductMaterial => (new productMaterialActions.CreateProductMaterialSuccess(newProductMaterial))),
        catchError(err => of(new productMaterialActions.CreateProductMaterialFail(err)))
      )
    )
  );

  @Effect()
  updateProductMaterial$: Observable<Action> = this.actions$.pipe(
    ofType(productMaterialActions.ProductMaterialActionTypes.UpdateProductMaterial),
    map((action: productMaterialActions.UpdateProductMaterial) => action.payload),
    mergeMap((productMaterial: ProductMaterial) =>
      this.productMaterialService.updateProductMaterial(productMaterial).pipe(
        map(updatedProductMaterial => (new productMaterialActions.UpdateProductMaterialSuccess(updatedProductMaterial))),
        catchError(err => of(new productMaterialActions.UpdateProductMaterialFail(err)))
      )
    )
  );

  @Effect()
  deleteProductMaterial$: Observable<Action> = this.actions$.pipe(
    ofType(productMaterialActions.ProductMaterialActionTypes.DeleteProductMaterial),
    map((action: productMaterialActions.DeleteProductMaterial) => action.payload),
    mergeMap((productMaterialId: number) =>
      this.productMaterialService.deleteProductMaterial(productMaterialId).pipe(
        map(() => (new productMaterialActions.DeleteProductMaterialSuccess(productMaterialId))),
        catchError(err => of(new productMaterialActions.DeleteProductMaterialFail(err)))
      )
    )
  );

  @Effect()
  handleProductMaterialSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      productMaterialActions.ProductMaterialActionTypes.SetProductMaterialDataSourceParameters,
      productMaterialActions.ProductMaterialActionTypes.CreateProductMaterialSuccess,
      productMaterialActions.ProductMaterialActionTypes.UpdateProductMaterialSuccess,
      productMaterialActions.ProductMaterialActionTypes.DeleteProductMaterialSuccess
    ),
    map(() => (new productMaterialActions.LoadProductMaterial())
    ));

}
