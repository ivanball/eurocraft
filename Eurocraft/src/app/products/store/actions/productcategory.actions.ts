import { ProductCategory } from '../../models/productcategory';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum ProductCategoryActionTypes {
  SetCurrentProductCategory = '[Core] Set Current ProductCategory',
  ClearCurrentProductCategory = '[Core] Clear Current ProductCategory',
  InitializeCurrentProductCategory = '[Core] Initialize Current ProductCategory',
  SetProductCategoryDataSourceParameters = '[Core] Set ProductCategory DataSource Parameters',
  LoadProductCategory = '[Core] Load ProductCategory',
  LoadProductCategorySuccess = '[Core] Load ProductCategory Success',
  LoadProductCategoryFail = '[Core] Load ProductCategory Fail',
  LoadProductCategoryAll = '[Core] Load ProductCategory All',
  LoadProductCategoryAllSuccess = '[Core] Load ProductCategory All Success',
  LoadProductCategoryAllFail = '[Core] Load ProductCategory All Fail',
  CreateProductCategory = '[Core] Create ProductCategory',
  CreateProductCategorySuccess = '[Core] Create ProductCategory Success',
  CreateProductCategoryFail = '[Core] Create ProductCategory Fail',
  UpdateProductCategory = '[Core] Update ProductCategory',
  UpdateProductCategorySuccess = '[Core] Update ProductCategory Success',
  UpdateProductCategoryFail = '[Core] Update ProductCategory Fail',
  DeleteProductCategory = '[Core] Delete ProductCategory',
  DeleteProductCategorySuccess = '[Core] Delete ProductCategory Success',
  DeleteProductCategoryFail = '[Core] Delete ProductCategory Fail',
}

export class SetCurrentProductCategory implements Action {
  readonly type = ProductCategoryActionTypes.SetCurrentProductCategory;

  constructor(public payload: ProductCategory) { }
}

export class ClearCurrentProductCategory implements Action {
  readonly type = ProductCategoryActionTypes.ClearCurrentProductCategory;
}

export class InitializeCurrentProductCategory implements Action {
  readonly type = ProductCategoryActionTypes.InitializeCurrentProductCategory;
}

export class SetProductCategoryDataSourceParameters implements Action {
  readonly type = ProductCategoryActionTypes.SetProductCategoryDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadProductCategory implements Action {
  readonly type = ProductCategoryActionTypes.LoadProductCategory;
}

export class LoadProductCategorySuccess implements Action {
  readonly type = ProductCategoryActionTypes.LoadProductCategorySuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadProductCategoryFail implements Action {
  readonly type = ProductCategoryActionTypes.LoadProductCategoryFail;

  constructor(public payload: string) { }
}

export class LoadProductCategoryAll implements Action {
  readonly type = ProductCategoryActionTypes.LoadProductCategoryAll;
}

export class LoadProductCategoryAllSuccess implements Action {
  readonly type = ProductCategoryActionTypes.LoadProductCategoryAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadProductCategoryAllFail implements Action {
  readonly type = ProductCategoryActionTypes.LoadProductCategoryAllFail;

  constructor(public payload: string) { }
}

export class CreateProductCategory implements Action {
  readonly type = ProductCategoryActionTypes.CreateProductCategory;

  constructor(public payload: ProductCategory) { }
}

export class CreateProductCategorySuccess implements Action {
  readonly type = ProductCategoryActionTypes.CreateProductCategorySuccess;

  constructor(public payload: ProductCategory) { }
}

export class CreateProductCategoryFail implements Action {
  readonly type = ProductCategoryActionTypes.CreateProductCategoryFail;

  constructor(public payload: string) { }
}

export class UpdateProductCategory implements Action {
  readonly type = ProductCategoryActionTypes.UpdateProductCategory;

  constructor(public payload: ProductCategory) { }
}

export class UpdateProductCategorySuccess implements Action {
  readonly type = ProductCategoryActionTypes.UpdateProductCategorySuccess;

  constructor(public payload: ProductCategory) { }
}

export class UpdateProductCategoryFail implements Action {
  readonly type = ProductCategoryActionTypes.UpdateProductCategoryFail;

  constructor(public payload: string) { }
}

export class DeleteProductCategory implements Action {
  readonly type = ProductCategoryActionTypes.DeleteProductCategory;

  constructor(public payload: number) { }
}

export class DeleteProductCategorySuccess implements Action {
  readonly type = ProductCategoryActionTypes.DeleteProductCategorySuccess;

  constructor(public payload: number) { }
}

export class DeleteProductCategoryFail implements Action {
  readonly type = ProductCategoryActionTypes.DeleteProductCategoryFail;

  constructor(public payload: string) { }
}

export type ProductCategoryActions = SetCurrentProductCategory
  | ClearCurrentProductCategory
  | InitializeCurrentProductCategory
  | SetProductCategoryDataSourceParameters
  | LoadProductCategory
  | LoadProductCategorySuccess
  | LoadProductCategoryFail
  | LoadProductCategoryAll
  | LoadProductCategoryAllSuccess
  | LoadProductCategoryAllFail
  | CreateProductCategory
  | CreateProductCategorySuccess
  | CreateProductCategoryFail
  | UpdateProductCategory
  | UpdateProductCategorySuccess
  | UpdateProductCategoryFail
  | DeleteProductCategory
  | DeleteProductCategorySuccess
  | DeleteProductCategoryFail;
