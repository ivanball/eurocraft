import { ProductModel } from '../../models/productmodel';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum ProductModelActionTypes {
  SetCurrentProductModel = '[Core] Set Current ProductModel',
  ClearCurrentProductModel = '[Core] Clear Current ProductModel',
  InitializeCurrentProductModel = '[Core] Initialize Current ProductModel',
  SetProductModelDataSourceParameters = '[Core] Set ProductModel DataSource Parameters',
  LoadProductModel = '[Core] Load ProductModel',
  LoadProductModelSuccess = '[Core] Load ProductModel Success',
  LoadProductModelFail = '[Core] Load ProductModel Fail',
  LoadProductModelAll = '[Core] Load ProductModel All',
  LoadProductModelAllSuccess = '[Core] Load ProductModel All Success',
  LoadProductModelAllFail = '[Core] Load ProductModel All Fail',
  CreateProductModel = '[Core] Create ProductModel',
  CreateProductModelSuccess = '[Core] Create ProductModel Success',
  CreateProductModelFail = '[Core] Create ProductModel Fail',
  UpdateProductModel = '[Core] Update ProductModel',
  UpdateProductModelSuccess = '[Core] Update ProductModel Success',
  UpdateProductModelFail = '[Core] Update ProductModel Fail',
  DeleteProductModel = '[Core] Delete ProductModel',
  DeleteProductModelSuccess = '[Core] Delete ProductModel Success',
  DeleteProductModelFail = '[Core] Delete ProductModel Fail',
}

export class SetCurrentProductModel implements Action {
  readonly type = ProductModelActionTypes.SetCurrentProductModel;

  constructor(public payload: ProductModel) { }
}

export class ClearCurrentProductModel implements Action {
  readonly type = ProductModelActionTypes.ClearCurrentProductModel;
}

export class InitializeCurrentProductModel implements Action {
  readonly type = ProductModelActionTypes.InitializeCurrentProductModel;
}

export class SetProductModelDataSourceParameters implements Action {
  readonly type = ProductModelActionTypes.SetProductModelDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadProductModel implements Action {
  readonly type = ProductModelActionTypes.LoadProductModel;
}

export class LoadProductModelSuccess implements Action {
  readonly type = ProductModelActionTypes.LoadProductModelSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadProductModelFail implements Action {
  readonly type = ProductModelActionTypes.LoadProductModelFail;

  constructor(public payload: string) { }
}

export class LoadProductModelAll implements Action {
  readonly type = ProductModelActionTypes.LoadProductModelAll;
}

export class LoadProductModelAllSuccess implements Action {
  readonly type = ProductModelActionTypes.LoadProductModelAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadProductModelAllFail implements Action {
  readonly type = ProductModelActionTypes.LoadProductModelAllFail;

  constructor(public payload: string) { }
}

export class CreateProductModel implements Action {
  readonly type = ProductModelActionTypes.CreateProductModel;

  constructor(public payload: ProductModel) { }
}

export class CreateProductModelSuccess implements Action {
  readonly type = ProductModelActionTypes.CreateProductModelSuccess;

  constructor(public payload: ProductModel) { }
}

export class CreateProductModelFail implements Action {
  readonly type = ProductModelActionTypes.CreateProductModelFail;

  constructor(public payload: string) { }
}

export class UpdateProductModel implements Action {
  readonly type = ProductModelActionTypes.UpdateProductModel;

  constructor(public payload: ProductModel) { }
}

export class UpdateProductModelSuccess implements Action {
  readonly type = ProductModelActionTypes.UpdateProductModelSuccess;

  constructor(public payload: ProductModel) { }
}

export class UpdateProductModelFail implements Action {
  readonly type = ProductModelActionTypes.UpdateProductModelFail;

  constructor(public payload: string) { }
}

export class DeleteProductModel implements Action {
  readonly type = ProductModelActionTypes.DeleteProductModel;

  constructor(public payload: number) { }
}

export class DeleteProductModelSuccess implements Action {
  readonly type = ProductModelActionTypes.DeleteProductModelSuccess;

  constructor(public payload: number) { }
}

export class DeleteProductModelFail implements Action {
  readonly type = ProductModelActionTypes.DeleteProductModelFail;

  constructor(public payload: string) { }
}

export type ProductModelActions = SetCurrentProductModel
  | ClearCurrentProductModel
  | InitializeCurrentProductModel
  | SetProductModelDataSourceParameters
  | LoadProductModel
  | LoadProductModelSuccess
  | LoadProductModelFail
  | LoadProductModelAll
  | LoadProductModelAllSuccess
  | LoadProductModelAllFail
  | CreateProductModel
  | CreateProductModelSuccess
  | CreateProductModelFail
  | UpdateProductModel
  | UpdateProductModelSuccess
  | UpdateProductModelFail
  | DeleteProductModel
  | DeleteProductModelSuccess
  | DeleteProductModelFail;
