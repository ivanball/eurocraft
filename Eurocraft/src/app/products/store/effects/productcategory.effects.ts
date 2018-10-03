import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as productCategoryActions from '../actions/productcategory.actions';
import { ProductCategoryService } from '../../services/productcategory.service';
import { ProductCategory } from '../../models/productcategory';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class ProductCategoryEffects {

  constructor(
    private actions$: Actions,
    private productCategoryService: ProductCategoryService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadProductCategories$: Observable<Action> = this.actions$.pipe(
    ofType(productCategoryActions.ProductCategoryActionTypes.LoadProductCategory),
    withLatestFrom(this.store$.select(selectors.getProductCategoryDataSourceParameters)),
    mergeMap(([action, productCategoryDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.productCategoryService.getProductCategories2(productCategoryDataSourceParameters).pipe(
        map(productCategories => (new productCategoryActions.LoadProductCategorySuccess(productCategories))),
        catchError(err => of(new productCategoryActions.LoadProductCategoryFail(err)))
      )
    )
  );

  @Effect()
  loadProductCategoriesAll$: Observable<Action> = this.actions$.pipe(
    ofType(productCategoryActions.ProductCategoryActionTypes.LoadProductCategoryAll),
    mergeMap((action: Action) =>
      this.productCategoryService.getProductCategories().pipe(
        map(productCategories => (new productCategoryActions.LoadProductCategoryAllSuccess(productCategories))),
        catchError(err => of(new productCategoryActions.LoadProductCategoryAllFail(err)))
      )
    )
  );

  @Effect()
  createProductCategory$: Observable<Action> = this.actions$.pipe(
    ofType(productCategoryActions.ProductCategoryActionTypes.CreateProductCategory),
    map((action: productCategoryActions.CreateProductCategory) => action.payload),
    mergeMap((productCategory: ProductCategory) =>
      this.productCategoryService.createProductCategory(productCategory).pipe(
        map(newProductCategory => (new productCategoryActions.CreateProductCategorySuccess(newProductCategory))),
        catchError(err => of(new productCategoryActions.CreateProductCategoryFail(err)))
      )
    )
  );

  @Effect()
  updateProductCategory$: Observable<Action> = this.actions$.pipe(
    ofType(productCategoryActions.ProductCategoryActionTypes.UpdateProductCategory),
    map((action: productCategoryActions.UpdateProductCategory) => action.payload),
    mergeMap((productCategory: ProductCategory) =>
      this.productCategoryService.updateProductCategory(productCategory).pipe(
        map(updatedProductCategory => (new productCategoryActions.UpdateProductCategorySuccess(updatedProductCategory))),
        catchError(err => of(new productCategoryActions.UpdateProductCategoryFail(err)))
      )
    )
  );

  @Effect()
  deleteProductCategory$: Observable<Action> = this.actions$.pipe(
    ofType(productCategoryActions.ProductCategoryActionTypes.DeleteProductCategory),
    map((action: productCategoryActions.DeleteProductCategory) => action.payload),
    mergeMap((productCategoryId: number) =>
      this.productCategoryService.deleteProductCategory(productCategoryId).pipe(
        map(() => (new productCategoryActions.DeleteProductCategorySuccess(productCategoryId))),
        catchError(err => of(new productCategoryActions.DeleteProductCategoryFail(err)))
      )
    )
  );

  @Effect()
  handleProductCategorySuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      productCategoryActions.ProductCategoryActionTypes.SetProductCategoryDataSourceParameters,
      productCategoryActions.ProductCategoryActionTypes.CreateProductCategorySuccess,
      productCategoryActions.ProductCategoryActionTypes.UpdateProductCategorySuccess,
      productCategoryActions.ProductCategoryActionTypes.DeleteProductCategorySuccess
    ),
    map(() => (new productCategoryActions.LoadProductCategory())
    ));

}
