import { ProductSubcategory } from '../../models/productsubcategory';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum ProductSubcategoryActionTypes {
  SetCurrentProductSubcategory = '[Core] Set Current ProductSubcategory',
  ClearCurrentProductSubcategory = '[Core] Clear Current ProductSubcategory',
  InitializeCurrentProductSubcategory = '[Core] Initialize Current ProductSubcategory',
  SetProductSubcategoryDataSourceParameters = '[Core] Set ProductSubcategory DataSource Parameters',
  LoadProductSubcategory = '[Core] Load ProductSubcategory',
  LoadProductSubcategorySuccess = '[Core] Load ProductSubcategory Success',
  LoadProductSubcategoryFail = '[Core] Load ProductSubcategory Fail',
  LoadProductSubcategoryAll = '[Core] Load ProductSubcategory All',
  LoadProductSubcategoryAllSuccess = '[Core] Load ProductSubcategory All Success',
  LoadProductSubcategoryAllFail = '[Core] Load ProductSubcategory All Fail',
  CreateProductSubcategory = '[Core] Create ProductSubcategory',
  CreateProductSubcategorySuccess = '[Core] Create ProductSubcategory Success',
  CreateProductSubcategoryFail = '[Core] Create ProductSubcategory Fail',
  UpdateProductSubcategory = '[Core] Update ProductSubcategory',
  UpdateProductSubcategorySuccess = '[Core] Update ProductSubcategory Success',
  UpdateProductSubcategoryFail = '[Core] Update ProductSubcategory Fail',
  DeleteProductSubcategory = '[Core] Delete ProductSubcategory',
  DeleteProductSubcategorySuccess = '[Core] Delete ProductSubcategory Success',
  DeleteProductSubcategoryFail = '[Core] Delete ProductSubcategory Fail',
}

export class SetCurrentProductSubcategory implements Action {
  readonly type = ProductSubcategoryActionTypes.SetCurrentProductSubcategory;

  constructor(public payload: ProductSubcategory) { }
}

export class ClearCurrentProductSubcategory implements Action {
  readonly type = ProductSubcategoryActionTypes.ClearCurrentProductSubcategory;
}

export class InitializeCurrentProductSubcategory implements Action {
  readonly type = ProductSubcategoryActionTypes.InitializeCurrentProductSubcategory;
}

export class SetProductSubcategoryDataSourceParameters implements Action {
  readonly type = ProductSubcategoryActionTypes.SetProductSubcategoryDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadProductSubcategory implements Action {
  readonly type = ProductSubcategoryActionTypes.LoadProductSubcategory;
}

export class LoadProductSubcategorySuccess implements Action {
  readonly type = ProductSubcategoryActionTypes.LoadProductSubcategorySuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadProductSubcategoryFail implements Action {
  readonly type = ProductSubcategoryActionTypes.LoadProductSubcategoryFail;

  constructor(public payload: string) { }
}

export class LoadProductSubcategoryAll implements Action {
  readonly type = ProductSubcategoryActionTypes.LoadProductSubcategoryAll;
}

export class LoadProductSubcategoryAllSuccess implements Action {
  readonly type = ProductSubcategoryActionTypes.LoadProductSubcategoryAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadProductSubcategoryAllFail implements Action {
  readonly type = ProductSubcategoryActionTypes.LoadProductSubcategoryAllFail;

  constructor(public payload: string) { }
}

export class CreateProductSubcategory implements Action {
  readonly type = ProductSubcategoryActionTypes.CreateProductSubcategory;

  constructor(public payload: ProductSubcategory) { }
}

export class CreateProductSubcategorySuccess implements Action {
  readonly type = ProductSubcategoryActionTypes.CreateProductSubcategorySuccess;

  constructor(public payload: ProductSubcategory) { }
}

export class CreateProductSubcategoryFail implements Action {
  readonly type = ProductSubcategoryActionTypes.CreateProductSubcategoryFail;

  constructor(public payload: string) { }
}

export class UpdateProductSubcategory implements Action {
  readonly type = ProductSubcategoryActionTypes.UpdateProductSubcategory;

  constructor(public payload: ProductSubcategory) { }
}

export class UpdateProductSubcategorySuccess implements Action {
  readonly type = ProductSubcategoryActionTypes.UpdateProductSubcategorySuccess;

  constructor(public payload: ProductSubcategory) { }
}

export class UpdateProductSubcategoryFail implements Action {
  readonly type = ProductSubcategoryActionTypes.UpdateProductSubcategoryFail;

  constructor(public payload: string) { }
}

export class DeleteProductSubcategory implements Action {
  readonly type = ProductSubcategoryActionTypes.DeleteProductSubcategory;

  constructor(public payload: number) { }
}

export class DeleteProductSubcategorySuccess implements Action {
  readonly type = ProductSubcategoryActionTypes.DeleteProductSubcategorySuccess;

  constructor(public payload: number) { }
}

export class DeleteProductSubcategoryFail implements Action {
  readonly type = ProductSubcategoryActionTypes.DeleteProductSubcategoryFail;

  constructor(public payload: string) { }
}

export type ProductSubcategoryActions = SetCurrentProductSubcategory
  | ClearCurrentProductSubcategory
  | InitializeCurrentProductSubcategory
  | SetProductSubcategoryDataSourceParameters
  | LoadProductSubcategory
  | LoadProductSubcategorySuccess
  | LoadProductSubcategoryFail
  | LoadProductSubcategoryAll
  | LoadProductSubcategoryAllSuccess
  | LoadProductSubcategoryAllFail
  | CreateProductSubcategory
  | CreateProductSubcategorySuccess
  | CreateProductSubcategoryFail
  | UpdateProductSubcategory
  | UpdateProductSubcategorySuccess
  | UpdateProductSubcategoryFail
  | DeleteProductSubcategory
  | DeleteProductSubcategorySuccess
  | DeleteProductSubcategoryFail;
