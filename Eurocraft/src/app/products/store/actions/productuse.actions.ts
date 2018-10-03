import { ProductUse } from '../../models/productuse';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum ProductUseActionUses {
  SetCurrentProductUse = '[Core] Set Current ProductUse',
  ClearCurrentProductUse = '[Core] Clear Current ProductUse',
  InitializeCurrentProductUse = '[Core] Initialize Current ProductUse',
  SetProductUseDataSourceParameters = '[Core] Set ProductUse DataSource Parameters',
  LoadProductUse = '[Core] Load ProductUse',
  LoadProductUseSuccess = '[Core] Load ProductUse Success',
  LoadProductUseFail = '[Core] Load ProductUse Fail',
  LoadProductUseAll = '[Core] Load ProductUse All',
  LoadProductUseAllSuccess = '[Core] Load ProductUse All Success',
  LoadProductUseAllFail = '[Core] Load ProductUse All Fail',
  CreateProductUse = '[Core] Create ProductUse',
  CreateProductUseSuccess = '[Core] Create ProductUse Success',
  CreateProductUseFail = '[Core] Create ProductUse Fail',
  UpdateProductUse = '[Core] Update ProductUse',
  UpdateProductUseSuccess = '[Core] Update ProductUse Success',
  UpdateProductUseFail = '[Core] Update ProductUse Fail',
  DeleteProductUse = '[Core] Delete ProductUse',
  DeleteProductUseSuccess = '[Core] Delete ProductUse Success',
  DeleteProductUseFail = '[Core] Delete ProductUse Fail',
}

export class SetCurrentProductUse implements Action {
  readonly type = ProductUseActionUses.SetCurrentProductUse;

  constructor(public payload: ProductUse) { }
}

export class ClearCurrentProductUse implements Action {
  readonly type = ProductUseActionUses.ClearCurrentProductUse;
}

export class InitializeCurrentProductUse implements Action {
  readonly type = ProductUseActionUses.InitializeCurrentProductUse;
}

export class SetProductUseDataSourceParameters implements Action {
  readonly type = ProductUseActionUses.SetProductUseDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadProductUse implements Action {
  readonly type = ProductUseActionUses.LoadProductUse;
}

export class LoadProductUseSuccess implements Action {
  readonly type = ProductUseActionUses.LoadProductUseSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadProductUseFail implements Action {
  readonly type = ProductUseActionUses.LoadProductUseFail;

  constructor(public payload: string) { }
}

export class LoadProductUseAll implements Action {
  readonly type = ProductUseActionUses.LoadProductUseAll;
}

export class LoadProductUseAllSuccess implements Action {
  readonly type = ProductUseActionUses.LoadProductUseAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadProductUseAllFail implements Action {
  readonly type = ProductUseActionUses.LoadProductUseAllFail;

  constructor(public payload: string) { }
}

export class CreateProductUse implements Action {
  readonly type = ProductUseActionUses.CreateProductUse;

  constructor(public payload: ProductUse) { }
}

export class CreateProductUseSuccess implements Action {
  readonly type = ProductUseActionUses.CreateProductUseSuccess;

  constructor(public payload: ProductUse) { }
}

export class CreateProductUseFail implements Action {
  readonly type = ProductUseActionUses.CreateProductUseFail;

  constructor(public payload: string) { }
}

export class UpdateProductUse implements Action {
  readonly type = ProductUseActionUses.UpdateProductUse;

  constructor(public payload: ProductUse) { }
}

export class UpdateProductUseSuccess implements Action {
  readonly type = ProductUseActionUses.UpdateProductUseSuccess;

  constructor(public payload: ProductUse) { }
}

export class UpdateProductUseFail implements Action {
  readonly type = ProductUseActionUses.UpdateProductUseFail;

  constructor(public payload: string) { }
}

export class DeleteProductUse implements Action {
  readonly type = ProductUseActionUses.DeleteProductUse;

  constructor(public payload: number) { }
}

export class DeleteProductUseSuccess implements Action {
  readonly type = ProductUseActionUses.DeleteProductUseSuccess;

  constructor(public payload: number) { }
}

export class DeleteProductUseFail implements Action {
  readonly type = ProductUseActionUses.DeleteProductUseFail;

  constructor(public payload: string) { }
}

export type ProductUseActions = SetCurrentProductUse
  | ClearCurrentProductUse
  | InitializeCurrentProductUse
  | SetProductUseDataSourceParameters
  | LoadProductUse
  | LoadProductUseSuccess
  | LoadProductUseFail
  | LoadProductUseAll
  | LoadProductUseAllSuccess
  | LoadProductUseAllFail
  | CreateProductUse
  | CreateProductUseSuccess
  | CreateProductUseFail
  | UpdateProductUse
  | UpdateProductUseSuccess
  | UpdateProductUseFail
  | DeleteProductUse
  | DeleteProductUseSuccess
  | DeleteProductUseFail;
