import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as productTypeActions from '../actions/producttype.actions';
import { ProductTypeService } from '../../services/producttype.service';
import { ProductType } from '../../models/producttype';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class ProductTypeEffects {

  constructor(
    private actions$: Actions,
    private productTypeService: ProductTypeService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadProductTypes$: Observable<Action> = this.actions$.pipe(
    ofType(productTypeActions.ProductTypeActionTypes.LoadProductType),
    withLatestFrom(this.store$.select(selectors.getProductTypeDataSourceParameters)),
    mergeMap(([action, productTypeDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.productTypeService.getProductTypes2(productTypeDataSourceParameters).pipe(
        map(productTypes => (new productTypeActions.LoadProductTypeSuccess(productTypes))),
        catchError(err => of(new productTypeActions.LoadProductTypeFail(err)))
      )
    )
  );

  @Effect()
  loadProductTypesAll$: Observable<Action> = this.actions$.pipe(
    ofType(productTypeActions.ProductTypeActionTypes.LoadProductTypeAll),
    mergeMap((action: Action) =>
      this.productTypeService.getProductTypes().pipe(
        map(productTypes => (new productTypeActions.LoadProductTypeAllSuccess(productTypes))),
        catchError(err => of(new productTypeActions.LoadProductTypeAllFail(err)))
      )
    )
  );

  @Effect()
  createProductType$: Observable<Action> = this.actions$.pipe(
    ofType(productTypeActions.ProductTypeActionTypes.CreateProductType),
    map((action: productTypeActions.CreateProductType) => action.payload),
    mergeMap((productType: ProductType) =>
      this.productTypeService.createProductType(productType).pipe(
        map(newProductType => (new productTypeActions.CreateProductTypeSuccess(newProductType))),
        catchError(err => of(new productTypeActions.CreateProductTypeFail(err)))
      )
    )
  );

  @Effect()
  updateProductType$: Observable<Action> = this.actions$.pipe(
    ofType(productTypeActions.ProductTypeActionTypes.UpdateProductType),
    map((action: productTypeActions.UpdateProductType) => action.payload),
    mergeMap((productType: ProductType) =>
      this.productTypeService.updateProductType(productType).pipe(
        map(updatedProductType => (new productTypeActions.UpdateProductTypeSuccess(updatedProductType))),
        catchError(err => of(new productTypeActions.UpdateProductTypeFail(err)))
      )
    )
  );

  @Effect()
  deleteProductType$: Observable<Action> = this.actions$.pipe(
    ofType(productTypeActions.ProductTypeActionTypes.DeleteProductType),
    map((action: productTypeActions.DeleteProductType) => action.payload),
    mergeMap((productTypeId: number) =>
      this.productTypeService.deleteProductType(productTypeId).pipe(
        map(() => (new productTypeActions.DeleteProductTypeSuccess(productTypeId))),
        catchError(err => of(new productTypeActions.DeleteProductTypeFail(err)))
      )
    )
  );

  @Effect()
  handleProductTypeSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      productTypeActions.ProductTypeActionTypes.SetProductTypeDataSourceParameters,
      productTypeActions.ProductTypeActionTypes.CreateProductTypeSuccess,
      productTypeActions.ProductTypeActionTypes.UpdateProductTypeSuccess,
      productTypeActions.ProductTypeActionTypes.DeleteProductTypeSuccess
    ),
    map(() => (new productTypeActions.LoadProductType())
    ));

}
