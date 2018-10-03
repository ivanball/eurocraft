import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as productUseActions from '../actions/productuse.actions';
import { ProductUseService } from '../../services/productuse.service';
import { ProductUse } from '../../models/productuse';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class ProductUseEffects {

  constructor(
    private actions$: Actions,
    private productUseService: ProductUseService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadProductUses$: Observable<Action> = this.actions$.pipe(
    ofType(productUseActions.ProductUseActionUses.LoadProductUse),
    withLatestFrom(this.store$.select(selectors.getProductUseDataSourceParameters)),
    mergeMap(([action, productUseDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.productUseService.getProductUses2(productUseDataSourceParameters).pipe(
        map(productUses => (new productUseActions.LoadProductUseSuccess(productUses))),
        catchError(err => of(new productUseActions.LoadProductUseFail(err)))
      )
    )
  );

  @Effect()
  loadProductUsesAll$: Observable<Action> = this.actions$.pipe(
    ofType(productUseActions.ProductUseActionUses.LoadProductUseAll),
    mergeMap((action: Action) =>
      this.productUseService.getProductUses().pipe(
        map(productUses => (new productUseActions.LoadProductUseAllSuccess(productUses))),
        catchError(err => of(new productUseActions.LoadProductUseAllFail(err)))
      )
    )
  );

  @Effect()
  createProductUse$: Observable<Action> = this.actions$.pipe(
    ofType(productUseActions.ProductUseActionUses.CreateProductUse),
    map((action: productUseActions.CreateProductUse) => action.payload),
    mergeMap((productUse: ProductUse) =>
      this.productUseService.createProductUse(productUse).pipe(
        map(newProductUse => (new productUseActions.CreateProductUseSuccess(newProductUse))),
        catchError(err => of(new productUseActions.CreateProductUseFail(err)))
      )
    )
  );

  @Effect()
  updateProductUse$: Observable<Action> = this.actions$.pipe(
    ofType(productUseActions.ProductUseActionUses.UpdateProductUse),
    map((action: productUseActions.UpdateProductUse) => action.payload),
    mergeMap((productUse: ProductUse) =>
      this.productUseService.updateProductUse(productUse).pipe(
        map(updatedProductUse => (new productUseActions.UpdateProductUseSuccess(updatedProductUse))),
        catchError(err => of(new productUseActions.UpdateProductUseFail(err)))
      )
    )
  );

  @Effect()
  deleteProductUse$: Observable<Action> = this.actions$.pipe(
    ofType(productUseActions.ProductUseActionUses.DeleteProductUse),
    map((action: productUseActions.DeleteProductUse) => action.payload),
    mergeMap((productUseId: number) =>
      this.productUseService.deleteProductUse(productUseId).pipe(
        map(() => (new productUseActions.DeleteProductUseSuccess(productUseId))),
        catchError(err => of(new productUseActions.DeleteProductUseFail(err)))
      )
    )
  );

  @Effect()
  handleProductUseSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      productUseActions.ProductUseActionUses.SetProductUseDataSourceParameters,
      productUseActions.ProductUseActionUses.CreateProductUseSuccess,
      productUseActions.ProductUseActionUses.UpdateProductUseSuccess,
      productUseActions.ProductUseActionUses.DeleteProductUseSuccess
    ),
    map(() => (new productUseActions.LoadProductUse())
    ));

}
