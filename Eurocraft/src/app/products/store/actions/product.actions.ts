import { Product } from '../../models/product';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum ProductActionTypes {
  SetCurrentProduct = '[Core] Set Current Product',
  ClearCurrentProduct = '[Core] Clear Current Product',
  InitializeCurrentProduct = '[Core] Initialize Current Product',
  SetProductDataSourceParameters = '[Core] Set Product DataSource Parameters',
  LoadProduct = '[Core] Load Product',
  LoadProductSuccess = '[Core] Load Product Success',
  LoadProductFail = '[Core] Load Product Fail',
  LoadProductAll = '[Core] Load Product All',
  LoadProductAllSuccess = '[Core] Load Product All Success',
  LoadProductAllFail = '[Core] Load Product All Fail',
  CreateProduct = '[Core] Create Product',
  CreateProductSuccess = '[Core] Create Product Success',
  CreateProductFail = '[Core] Create Product Fail',
  UpdateProduct = '[Core] Update Product',
  UpdateProductSuccess = '[Core] Update Product Success',
  UpdateProductFail = '[Core] Update Product Fail',
  DeleteProduct = '[Core] Delete Product',
  DeleteProductSuccess = '[Core] Delete Product Success',
  DeleteProductFail = '[Core] Delete Product Fail',
}

export class SetCurrentProduct implements Action {
  readonly type = ProductActionTypes.SetCurrentProduct;

  constructor(public payload: Product) { }
}

export class ClearCurrentProduct implements Action {
  readonly type = ProductActionTypes.ClearCurrentProduct;
}

export class InitializeCurrentProduct implements Action {
  readonly type = ProductActionTypes.InitializeCurrentProduct;
}

export class SetProductDataSourceParameters implements Action {
  readonly type = ProductActionTypes.SetProductDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadProduct implements Action {
  readonly type = ProductActionTypes.LoadProduct;
}

export class LoadProductSuccess implements Action {
  readonly type = ProductActionTypes.LoadProductSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadProductFail implements Action {
  readonly type = ProductActionTypes.LoadProductFail;

  constructor(public payload: string) { }
}

export class LoadProductAll implements Action {
  readonly type = ProductActionTypes.LoadProductAll;
}

export class LoadProductAllSuccess implements Action {
  readonly type = ProductActionTypes.LoadProductAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadProductAllFail implements Action {
  readonly type = ProductActionTypes.LoadProductAllFail;

  constructor(public payload: string) { }
}

export class CreateProduct implements Action {
  readonly type = ProductActionTypes.CreateProduct;

  constructor(public payload: Product) { }
}

export class CreateProductSuccess implements Action {
  readonly type = ProductActionTypes.CreateProductSuccess;

  constructor(public payload: Product) { }
}

export class CreateProductFail implements Action {
  readonly type = ProductActionTypes.CreateProductFail;

  constructor(public payload: string) { }
}

export class UpdateProduct implements Action {
  readonly type = ProductActionTypes.UpdateProduct;

  constructor(public payload: Product) { }
}

export class UpdateProductSuccess implements Action {
  readonly type = ProductActionTypes.UpdateProductSuccess;

  constructor(public payload: Product) { }
}

export class UpdateProductFail implements Action {
  readonly type = ProductActionTypes.UpdateProductFail;

  constructor(public payload: string) { }
}

export class DeleteProduct implements Action {
  readonly type = ProductActionTypes.DeleteProduct;

  constructor(public payload: number) { }
}

export class DeleteProductSuccess implements Action {
  readonly type = ProductActionTypes.DeleteProductSuccess;

  constructor(public payload: number) { }
}

export class DeleteProductFail implements Action {
  readonly type = ProductActionTypes.DeleteProductFail;

  constructor(public payload: string) { }
}

export type ProductActions = SetCurrentProduct
  | ClearCurrentProduct
  | InitializeCurrentProduct
  | SetProductDataSourceParameters
  | LoadProduct
  | LoadProductSuccess
  | LoadProductFail
  | LoadProductAll
  | LoadProductAllSuccess
  | LoadProductAllFail
  | CreateProduct
  | CreateProductSuccess
  | CreateProductFail
  | UpdateProduct
  | UpdateProductSuccess
  | UpdateProductFail
  | DeleteProduct
  | DeleteProductSuccess
  | DeleteProductFail;
