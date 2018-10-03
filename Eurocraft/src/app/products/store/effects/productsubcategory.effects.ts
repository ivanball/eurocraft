import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as productSubcategoryActions from '../actions/productsubcategory.actions';
import { ProductSubcategoryService } from '../../services/productsubcategory.service';
import { ProductSubcategory } from '../../models/productsubcategory';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class ProductSubcategoryEffects {

  constructor(
    private actions$: Actions,
    private productSubcategoryService: ProductSubcategoryService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadProductSubcategories$: Observable<Action> = this.actions$.pipe(
    ofType(productSubcategoryActions.ProductSubcategoryActionTypes.LoadProductSubcategory),
    withLatestFrom(this.store$.select(selectors.getProductSubcategoryDataSourceParameters)),
    mergeMap(([action, productSubcategoryDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.productSubcategoryService.getProductSubcategories2(productSubcategoryDataSourceParameters).pipe(
        map(productSubcategories => (new productSubcategoryActions.LoadProductSubcategorySuccess(productSubcategories))),
        catchError(err => of(new productSubcategoryActions.LoadProductSubcategoryFail(err)))
      )
    )
  );

  @Effect()
  loadProductSubcategoriesAll$: Observable<Action> = this.actions$.pipe(
    ofType(productSubcategoryActions.ProductSubcategoryActionTypes.LoadProductSubcategoryAll),
    mergeMap((action: Action) =>
      this.productSubcategoryService.getProductSubcategories().pipe(
        map(productSubcategories => (new productSubcategoryActions.LoadProductSubcategoryAllSuccess(productSubcategories))),
        catchError(err => of(new productSubcategoryActions.LoadProductSubcategoryAllFail(err)))
      )
    )
  );

  @Effect()
  createProductSubcategory$: Observable<Action> = this.actions$.pipe(
    ofType(productSubcategoryActions.ProductSubcategoryActionTypes.CreateProductSubcategory),
    map((action: productSubcategoryActions.CreateProductSubcategory) => action.payload),
    mergeMap((productSubcategory: ProductSubcategory) =>
      this.productSubcategoryService.createProductSubcategory(productSubcategory).pipe(
        map(newProductSubcategory => (new productSubcategoryActions.CreateProductSubcategorySuccess(newProductSubcategory))),
        catchError(err => of(new productSubcategoryActions.CreateProductSubcategoryFail(err)))
      )
    )
  );

  @Effect()
  updateProductSubcategory$: Observable<Action> = this.actions$.pipe(
    ofType(productSubcategoryActions.ProductSubcategoryActionTypes.UpdateProductSubcategory),
    map((action: productSubcategoryActions.UpdateProductSubcategory) => action.payload),
    mergeMap((productSubcategory: ProductSubcategory) =>
      this.productSubcategoryService.updateProductSubcategory(productSubcategory).pipe(
        map(updatedProductSubcategory => (new productSubcategoryActions.UpdateProductSubcategorySuccess(updatedProductSubcategory))),
        catchError(err => of(new productSubcategoryActions.UpdateProductSubcategoryFail(err)))
      )
    )
  );

  @Effect()
  deleteProductSubcategory$: Observable<Action> = this.actions$.pipe(
    ofType(productSubcategoryActions.ProductSubcategoryActionTypes.DeleteProductSubcategory),
    map((action: productSubcategoryActions.DeleteProductSubcategory) => action.payload),
    mergeMap((productSubcategoryId: number) =>
      this.productSubcategoryService.deleteProductSubcategory(productSubcategoryId).pipe(
        map(() => (new productSubcategoryActions.DeleteProductSubcategorySuccess(productSubcategoryId))),
        catchError(err => of(new productSubcategoryActions.DeleteProductSubcategoryFail(err)))
      )
    )
  );

  @Effect()
  handleProductSubcategorySuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      productSubcategoryActions.ProductSubcategoryActionTypes.SetProductSubcategoryDataSourceParameters,
      productSubcategoryActions.ProductSubcategoryActionTypes.CreateProductSubcategorySuccess,
      productSubcategoryActions.ProductSubcategoryActionTypes.UpdateProductSubcategorySuccess,
      productSubcategoryActions.ProductSubcategoryActionTypes.DeleteProductSubcategorySuccess
    ),
    map(() => (new productSubcategoryActions.LoadProductSubcategory())
    ));

}
