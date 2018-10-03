import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as productModelActions from '../actions/productmodel.actions';
import { ProductModelService } from '../../services/productmodel.service';
import { ProductModel } from '../../models/productmodel';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class ProductModelEffects {

  constructor(
    private actions$: Actions,
    private productModelService: ProductModelService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadProductModels$: Observable<Action> = this.actions$.pipe(
    ofType(productModelActions.ProductModelActionTypes.LoadProductModel),
    withLatestFrom(this.store$.select(selectors.getProductModelDataSourceParameters)),
    mergeMap(([action, productModelDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.productModelService.getProductModels2(productModelDataSourceParameters).pipe(
        map(productModels => (new productModelActions.LoadProductModelSuccess(productModels))),
        catchError(err => of(new productModelActions.LoadProductModelFail(err)))
      )
    )
  );

  @Effect()
  loadProductModelsAll$: Observable<Action> = this.actions$.pipe(
    ofType(productModelActions.ProductModelActionTypes.LoadProductModelAll),
    mergeMap((action: Action) =>
      this.productModelService.getProductModels().pipe(
        map(productModels => (new productModelActions.LoadProductModelAllSuccess(productModels))),
        catchError(err => of(new productModelActions.LoadProductModelAllFail(err)))
      )
    )
  );

  @Effect()
  createProductModel$: Observable<Action> = this.actions$.pipe(
    ofType(productModelActions.ProductModelActionTypes.CreateProductModel),
    map((action: productModelActions.CreateProductModel) => action.payload),
    mergeMap((productModel: ProductModel) =>
      this.productModelService.createProductModel(productModel).pipe(
        map(newProductModel => (new productModelActions.CreateProductModelSuccess(newProductModel))),
        catchError(err => of(new productModelActions.CreateProductModelFail(err)))
      )
    )
  );

  @Effect()
  updateProductModel$: Observable<Action> = this.actions$.pipe(
    ofType(productModelActions.ProductModelActionTypes.UpdateProductModel),
    map((action: productModelActions.UpdateProductModel) => action.payload),
    mergeMap((productModel: ProductModel) =>
      this.productModelService.updateProductModel(productModel).pipe(
        map(updatedProductModel => (new productModelActions.UpdateProductModelSuccess(updatedProductModel))),
        catchError(err => of(new productModelActions.UpdateProductModelFail(err)))
      )
    )
  );

  @Effect()
  deleteProductModel$: Observable<Action> = this.actions$.pipe(
    ofType(productModelActions.ProductModelActionTypes.DeleteProductModel),
    map((action: productModelActions.DeleteProductModel) => action.payload),
    mergeMap((productModelId: number) =>
      this.productModelService.deleteProductModel(productModelId).pipe(
        map(() => (new productModelActions.DeleteProductModelSuccess(productModelId))),
        catchError(err => of(new productModelActions.DeleteProductModelFail(err)))
      )
    )
  );

  @Effect()
  handleProductModelSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      productModelActions.ProductModelActionTypes.SetProductModelDataSourceParameters,
      productModelActions.ProductModelActionTypes.CreateProductModelSuccess,
      productModelActions.ProductModelActionTypes.UpdateProductModelSuccess,
      productModelActions.ProductModelActionTypes.DeleteProductModelSuccess
    ),
    map(() => (new productModelActions.LoadProductModel())
    ));

}
