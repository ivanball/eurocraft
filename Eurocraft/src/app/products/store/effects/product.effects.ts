import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as productActions from '../actions/product.actions';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class ProductEffects {

  constructor(
    private actions$: Actions,
    private productService: ProductService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadProducts$: Observable<Action> = this.actions$.pipe(
    ofType(productActions.ProductActionTypes.LoadProduct),
    withLatestFrom(this.store$.select(selectors.getProductDataSourceParameters)),
    mergeMap(([action, productDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.productService.getProducts2(productDataSourceParameters).pipe(
        map(products => (new productActions.LoadProductSuccess(products))),
        catchError(err => of(new productActions.LoadProductFail(err)))
      )
    )
  );

  @Effect()
  loadProductsAll$: Observable<Action> = this.actions$.pipe(
    ofType(productActions.ProductActionTypes.LoadProductAll),
    mergeMap((action: Action) =>
      this.productService.getProducts().pipe(
        map(products => (new productActions.LoadProductAllSuccess(products))),
        catchError(err => of(new productActions.LoadProductAllFail(err)))
      )
    )
  );

  @Effect()
  createProduct$: Observable<Action> = this.actions$.pipe(
    ofType(productActions.ProductActionTypes.CreateProduct),
    map((action: productActions.CreateProduct) => action.payload),
    mergeMap((product: Product) =>
      this.productService.createProduct(product).pipe(
        map(newProduct => (new productActions.CreateProductSuccess(newProduct))),
        catchError(err => of(new productActions.CreateProductFail(err)))
      )
    )
  );

  @Effect()
  updateProduct$: Observable<Action> = this.actions$.pipe(
    ofType(productActions.ProductActionTypes.UpdateProduct),
    map((action: productActions.UpdateProduct) => action.payload),
    mergeMap((product: Product) =>
      this.productService.updateProduct(product).pipe(
        map(updatedProduct => (new productActions.UpdateProductSuccess(updatedProduct))),
        catchError(err => of(new productActions.UpdateProductFail(err)))
      )
    )
  );

  @Effect()
  deleteProduct$: Observable<Action> = this.actions$.pipe(
    ofType(productActions.ProductActionTypes.DeleteProduct),
    map((action: productActions.DeleteProduct) => action.payload),
    mergeMap((productId: number) =>
      this.productService.deleteProduct(productId).pipe(
        map(() => (new productActions.DeleteProductSuccess(productId))),
        catchError(err => of(new productActions.DeleteProductFail(err)))
      )
    )
  );

  @Effect()
  handleProductSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      productActions.ProductActionTypes.SetProductDataSourceParameters,
      productActions.ProductActionTypes.CreateProductSuccess,
      productActions.ProductActionTypes.UpdateProductSuccess,
      productActions.ProductActionTypes.DeleteProductSuccess
    ),
    map(() => (new productActions.LoadProduct())
    ));

}
