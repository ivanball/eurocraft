import { BillOfMaterial } from '../../models/billofmaterial';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum BillOfMaterialActionTypes {
  SetCurrentBillOfMaterial = '[Core] Set Current BillOfMaterial',
  ClearCurrentBillOfMaterial = '[Core] Clear Current BillOfMaterial',
  InitializeCurrentBillOfMaterial = '[Core] Initialize Current BillOfMaterial',
  SetBillOfMaterialDataSourceParameters = '[Core] Set BillOfMaterial DataSource Parameters',
  LoadBillOfMaterial = '[Core] Load BillOfMaterial',
  LoadBillOfMaterialSuccess = '[Core] Load BillOfMaterial Success',
  LoadBillOfMaterialFail = '[Core] Load BillOfMaterial Fail',
  LoadBillOfMaterialAll = '[Core] Load BillOfMaterial All',
  LoadBillOfMaterialAllSuccess = '[Core] Load BillOfMaterial All Success',
  LoadBillOfMaterialAllFail = '[Core] Load BillOfMaterial All Fail',
  CreateBillOfMaterial = '[Core] Create BillOfMaterial',
  CreateBillOfMaterialSuccess = '[Core] Create BillOfMaterial Success',
  CreateBillOfMaterialFail = '[Core] Create BillOfMaterial Fail',
  UpdateBillOfMaterial = '[Core] Update BillOfMaterial',
  UpdateBillOfMaterialSuccess = '[Core] Update BillOfMaterial Success',
  UpdateBillOfMaterialFail = '[Core] Update BillOfMaterial Fail',
  DeleteBillOfMaterial = '[Core] Delete BillOfMaterial',
  DeleteBillOfMaterialSuccess = '[Core] Delete BillOfMaterial Success',
  DeleteBillOfMaterialFail = '[Core] Delete BillOfMaterial Fail',
}

export class SetCurrentBillOfMaterial implements Action {
  readonly type = BillOfMaterialActionTypes.SetCurrentBillOfMaterial;

  constructor(public payload: BillOfMaterial) { }
}

export class ClearCurrentBillOfMaterial implements Action {
  readonly type = BillOfMaterialActionTypes.ClearCurrentBillOfMaterial;
}

export class InitializeCurrentBillOfMaterial implements Action {
  readonly type = BillOfMaterialActionTypes.InitializeCurrentBillOfMaterial;
}

export class SetBillOfMaterialDataSourceParameters implements Action {
  readonly type = BillOfMaterialActionTypes.SetBillOfMaterialDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadBillOfMaterial implements Action {
  readonly type = BillOfMaterialActionTypes.LoadBillOfMaterial;
}

export class LoadBillOfMaterialSuccess implements Action {
  readonly type = BillOfMaterialActionTypes.LoadBillOfMaterialSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadBillOfMaterialFail implements Action {
  readonly type = BillOfMaterialActionTypes.LoadBillOfMaterialFail;

  constructor(public payload: string) { }
}

export class LoadBillOfMaterialAll implements Action {
  readonly type = BillOfMaterialActionTypes.LoadBillOfMaterialAll;
}

export class LoadBillOfMaterialAllSuccess implements Action {
  readonly type = BillOfMaterialActionTypes.LoadBillOfMaterialAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadBillOfMaterialAllFail implements Action {
  readonly type = BillOfMaterialActionTypes.LoadBillOfMaterialAllFail;

  constructor(public payload: string) { }
}

export class CreateBillOfMaterial implements Action {
  readonly type = BillOfMaterialActionTypes.CreateBillOfMaterial;

  constructor(public payload: BillOfMaterial) { }
}

export class CreateBillOfMaterialSuccess implements Action {
  readonly type = BillOfMaterialActionTypes.CreateBillOfMaterialSuccess;

  constructor(public payload: BillOfMaterial) { }
}

export class CreateBillOfMaterialFail implements Action {
  readonly type = BillOfMaterialActionTypes.CreateBillOfMaterialFail;

  constructor(public payload: string) { }
}

export class UpdateBillOfMaterial implements Action {
  readonly type = BillOfMaterialActionTypes.UpdateBillOfMaterial;

  constructor(public payload: BillOfMaterial) { }
}

export class UpdateBillOfMaterialSuccess implements Action {
  readonly type = BillOfMaterialActionTypes.UpdateBillOfMaterialSuccess;

  constructor(public payload: BillOfMaterial) { }
}

export class UpdateBillOfMaterialFail implements Action {
  readonly type = BillOfMaterialActionTypes.UpdateBillOfMaterialFail;

  constructor(public payload: string) { }
}

export class DeleteBillOfMaterial implements Action {
  readonly type = BillOfMaterialActionTypes.DeleteBillOfMaterial;

  constructor(public payload: number) { }
}

export class DeleteBillOfMaterialSuccess implements Action {
  readonly type = BillOfMaterialActionTypes.DeleteBillOfMaterialSuccess;

  constructor(public payload: number) { }
}

export class DeleteBillOfMaterialFail implements Action {
  readonly type = BillOfMaterialActionTypes.DeleteBillOfMaterialFail;

  constructor(public payload: string) { }
}

export type BillOfMaterialActions = SetCurrentBillOfMaterial
  | ClearCurrentBillOfMaterial
  | InitializeCurrentBillOfMaterial
  | SetBillOfMaterialDataSourceParameters
  | LoadBillOfMaterial
  | LoadBillOfMaterialSuccess
  | LoadBillOfMaterialFail
  | LoadBillOfMaterialAll
  | LoadBillOfMaterialAllSuccess
  | LoadBillOfMaterialAllFail
  | CreateBillOfMaterial
  | CreateBillOfMaterialSuccess
  | CreateBillOfMaterialFail
  | UpdateBillOfMaterial
  | UpdateBillOfMaterialSuccess
  | UpdateBillOfMaterialFail
  | DeleteBillOfMaterial
  | DeleteBillOfMaterialSuccess
  | DeleteBillOfMaterialFail;
