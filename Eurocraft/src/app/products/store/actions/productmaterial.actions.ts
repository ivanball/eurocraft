import { ProductMaterial } from '../../models/productmaterial';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum ProductMaterialActionTypes {
  SetCurrentProductMaterial = '[Core] Set Current ProductMaterial',
  ClearCurrentProductMaterial = '[Core] Clear Current ProductMaterial',
  InitializeCurrentProductMaterial = '[Core] Initialize Current ProductMaterial',
  SetProductMaterialDataSourceParameters = '[Core] Set ProductMaterial DataSource Parameters',
  LoadProductMaterial = '[Core] Load ProductMaterial',
  LoadProductMaterialSuccess = '[Core] Load ProductMaterial Success',
  LoadProductMaterialFail = '[Core] Load ProductMaterial Fail',
  LoadProductMaterialAll = '[Core] Load ProductMaterial All',
  LoadProductMaterialAllSuccess = '[Core] Load ProductMaterial All Success',
  LoadProductMaterialAllFail = '[Core] Load ProductMaterial All Fail',
  CreateProductMaterial = '[Core] Create ProductMaterial',
  CreateProductMaterialSuccess = '[Core] Create ProductMaterial Success',
  CreateProductMaterialFail = '[Core] Create ProductMaterial Fail',
  UpdateProductMaterial = '[Core] Update ProductMaterial',
  UpdateProductMaterialSuccess = '[Core] Update ProductMaterial Success',
  UpdateProductMaterialFail = '[Core] Update ProductMaterial Fail',
  DeleteProductMaterial = '[Core] Delete ProductMaterial',
  DeleteProductMaterialSuccess = '[Core] Delete ProductMaterial Success',
  DeleteProductMaterialFail = '[Core] Delete ProductMaterial Fail',
}

export class SetCurrentProductMaterial implements Action {
  readonly type = ProductMaterialActionTypes.SetCurrentProductMaterial;

  constructor(public payload: ProductMaterial) { }
}

export class ClearCurrentProductMaterial implements Action {
  readonly type = ProductMaterialActionTypes.ClearCurrentProductMaterial;
}

export class InitializeCurrentProductMaterial implements Action {
  readonly type = ProductMaterialActionTypes.InitializeCurrentProductMaterial;
}

export class SetProductMaterialDataSourceParameters implements Action {
  readonly type = ProductMaterialActionTypes.SetProductMaterialDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadProductMaterial implements Action {
  readonly type = ProductMaterialActionTypes.LoadProductMaterial;
}

export class LoadProductMaterialSuccess implements Action {
  readonly type = ProductMaterialActionTypes.LoadProductMaterialSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadProductMaterialFail implements Action {
  readonly type = ProductMaterialActionTypes.LoadProductMaterialFail;

  constructor(public payload: string) { }
}

export class LoadProductMaterialAll implements Action {
  readonly type = ProductMaterialActionTypes.LoadProductMaterialAll;
}

export class LoadProductMaterialAllSuccess implements Action {
  readonly type = ProductMaterialActionTypes.LoadProductMaterialAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadProductMaterialAllFail implements Action {
  readonly type = ProductMaterialActionTypes.LoadProductMaterialAllFail;

  constructor(public payload: string) { }
}

export class CreateProductMaterial implements Action {
  readonly type = ProductMaterialActionTypes.CreateProductMaterial;

  constructor(public payload: ProductMaterial) { }
}

export class CreateProductMaterialSuccess implements Action {
  readonly type = ProductMaterialActionTypes.CreateProductMaterialSuccess;

  constructor(public payload: ProductMaterial) { }
}

export class CreateProductMaterialFail implements Action {
  readonly type = ProductMaterialActionTypes.CreateProductMaterialFail;

  constructor(public payload: string) { }
}

export class UpdateProductMaterial implements Action {
  readonly type = ProductMaterialActionTypes.UpdateProductMaterial;

  constructor(public payload: ProductMaterial) { }
}

export class UpdateProductMaterialSuccess implements Action {
  readonly type = ProductMaterialActionTypes.UpdateProductMaterialSuccess;

  constructor(public payload: ProductMaterial) { }
}

export class UpdateProductMaterialFail implements Action {
  readonly type = ProductMaterialActionTypes.UpdateProductMaterialFail;

  constructor(public payload: string) { }
}

export class DeleteProductMaterial implements Action {
  readonly type = ProductMaterialActionTypes.DeleteProductMaterial;

  constructor(public payload: number) { }
}

export class DeleteProductMaterialSuccess implements Action {
  readonly type = ProductMaterialActionTypes.DeleteProductMaterialSuccess;

  constructor(public payload: number) { }
}

export class DeleteProductMaterialFail implements Action {
  readonly type = ProductMaterialActionTypes.DeleteProductMaterialFail;

  constructor(public payload: string) { }
}

export type ProductMaterialActions = SetCurrentProductMaterial
  | ClearCurrentProductMaterial
  | InitializeCurrentProductMaterial
  | SetProductMaterialDataSourceParameters
  | LoadProductMaterial
  | LoadProductMaterialSuccess
  | LoadProductMaterialFail
  | LoadProductMaterialAll
  | LoadProductMaterialAllSuccess
  | LoadProductMaterialAllFail
  | CreateProductMaterial
  | CreateProductMaterialSuccess
  | CreateProductMaterialFail
  | UpdateProductMaterial
  | UpdateProductMaterialSuccess
  | UpdateProductMaterialFail
  | DeleteProductMaterial
  | DeleteProductMaterialSuccess
  | DeleteProductMaterialFail;
