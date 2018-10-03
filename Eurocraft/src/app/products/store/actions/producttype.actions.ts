import { ProductType } from '../../models/producttype';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum ProductTypeActionTypes {
  SetCurrentProductType = '[Core] Set Current ProductType',
  ClearCurrentProductType = '[Core] Clear Current ProductType',
  InitializeCurrentProductType = '[Core] Initialize Current ProductType',
  SetProductTypeDataSourceParameters = '[Core] Set ProductType DataSource Parameters',
  LoadProductType = '[Core] Load ProductType',
  LoadProductTypeSuccess = '[Core] Load ProductType Success',
  LoadProductTypeFail = '[Core] Load ProductType Fail',
  LoadProductTypeAll = '[Core] Load ProductType All',
  LoadProductTypeAllSuccess = '[Core] Load ProductType All Success',
  LoadProductTypeAllFail = '[Core] Load ProductType All Fail',
  CreateProductType = '[Core] Create ProductType',
  CreateProductTypeSuccess = '[Core] Create ProductType Success',
  CreateProductTypeFail = '[Core] Create ProductType Fail',
  UpdateProductType = '[Core] Update ProductType',
  UpdateProductTypeSuccess = '[Core] Update ProductType Success',
  UpdateProductTypeFail = '[Core] Update ProductType Fail',
  DeleteProductType = '[Core] Delete ProductType',
  DeleteProductTypeSuccess = '[Core] Delete ProductType Success',
  DeleteProductTypeFail = '[Core] Delete ProductType Fail',
}

export class SetCurrentProductType implements Action {
  readonly type = ProductTypeActionTypes.SetCurrentProductType;

  constructor(public payload: ProductType) { }
}

export class ClearCurrentProductType implements Action {
  readonly type = ProductTypeActionTypes.ClearCurrentProductType;
}

export class InitializeCurrentProductType implements Action {
  readonly type = ProductTypeActionTypes.InitializeCurrentProductType;
}

export class SetProductTypeDataSourceParameters implements Action {
  readonly type = ProductTypeActionTypes.SetProductTypeDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadProductType implements Action {
  readonly type = ProductTypeActionTypes.LoadProductType;
}

export class LoadProductTypeSuccess implements Action {
  readonly type = ProductTypeActionTypes.LoadProductTypeSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadProductTypeFail implements Action {
  readonly type = ProductTypeActionTypes.LoadProductTypeFail;

  constructor(public payload: string) { }
}

export class LoadProductTypeAll implements Action {
  readonly type = ProductTypeActionTypes.LoadProductTypeAll;
}

export class LoadProductTypeAllSuccess implements Action {
  readonly type = ProductTypeActionTypes.LoadProductTypeAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadProductTypeAllFail implements Action {
  readonly type = ProductTypeActionTypes.LoadProductTypeAllFail;

  constructor(public payload: string) { }
}

export class CreateProductType implements Action {
  readonly type = ProductTypeActionTypes.CreateProductType;

  constructor(public payload: ProductType) { }
}

export class CreateProductTypeSuccess implements Action {
  readonly type = ProductTypeActionTypes.CreateProductTypeSuccess;

  constructor(public payload: ProductType) { }
}

export class CreateProductTypeFail implements Action {
  readonly type = ProductTypeActionTypes.CreateProductTypeFail;

  constructor(public payload: string) { }
}

export class UpdateProductType implements Action {
  readonly type = ProductTypeActionTypes.UpdateProductType;

  constructor(public payload: ProductType) { }
}

export class UpdateProductTypeSuccess implements Action {
  readonly type = ProductTypeActionTypes.UpdateProductTypeSuccess;

  constructor(public payload: ProductType) { }
}

export class UpdateProductTypeFail implements Action {
  readonly type = ProductTypeActionTypes.UpdateProductTypeFail;

  constructor(public payload: string) { }
}

export class DeleteProductType implements Action {
  readonly type = ProductTypeActionTypes.DeleteProductType;

  constructor(public payload: number) { }
}

export class DeleteProductTypeSuccess implements Action {
  readonly type = ProductTypeActionTypes.DeleteProductTypeSuccess;

  constructor(public payload: number) { }
}

export class DeleteProductTypeFail implements Action {
  readonly type = ProductTypeActionTypes.DeleteProductTypeFail;

  constructor(public payload: string) { }
}

export type ProductTypeActions = SetCurrentProductType
  | ClearCurrentProductType
  | InitializeCurrentProductType
  | SetProductTypeDataSourceParameters
  | LoadProductType
  | LoadProductTypeSuccess
  | LoadProductTypeFail
  | LoadProductTypeAll
  | LoadProductTypeAllSuccess
  | LoadProductTypeAllFail
  | CreateProductType
  | CreateProductTypeSuccess
  | CreateProductTypeFail
  | UpdateProductType
  | UpdateProductTypeSuccess
  | UpdateProductTypeFail
  | DeleteProductType
  | DeleteProductTypeSuccess
  | DeleteProductTypeFail;
