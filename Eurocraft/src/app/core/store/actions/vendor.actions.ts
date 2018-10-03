import { Vendor } from '../../models/vendor';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum VendorActionTypes {
  SetCurrentVendor = '[Core] Set Current Vendor',
  ClearCurrentVendor = '[Core] Clear Current Vendor',
  InitializeCurrentVendor = '[Core] Initialize Current Vendor',
  SetVendorDataSourceParameters = '[Core] Set Vendor DataSource Parameters',
  LoadVendor = '[Core] Load Vendor',
  LoadVendorSuccess = '[Core] Load Vendor Success',
  LoadVendorFail = '[Core] Load Vendor Fail',
  LoadVendorAll = '[Core] Load Vendor All',
  LoadVendorAllSuccess = '[Core] Load Vendor All Success',
  LoadVendorAllFail = '[Core] Load Vendor All Fail',
  CreateVendor = '[Core] Create Vendor',
  CreateVendorSuccess = '[Core] Create Vendor Success',
  CreateVendorFail = '[Core] Create Vendor Fail',
  UpdateVendor = '[Core] Update Vendor',
  UpdateVendorSuccess = '[Core] Update Vendor Success',
  UpdateVendorFail = '[Core] Update Vendor Fail',
  DeleteVendor = '[Core] Delete Vendor',
  DeleteVendorSuccess = '[Core] Delete Vendor Success',
  DeleteVendorFail = '[Core] Delete Vendor Fail',
}

export class SetCurrentVendor implements Action {
  readonly type = VendorActionTypes.SetCurrentVendor;

  constructor(public payload: Vendor) { }
}

export class ClearCurrentVendor implements Action {
  readonly type = VendorActionTypes.ClearCurrentVendor;
}

export class InitializeCurrentVendor implements Action {
  readonly type = VendorActionTypes.InitializeCurrentVendor;
}

export class SetVendorDataSourceParameters implements Action {
  readonly type = VendorActionTypes.SetVendorDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadVendor implements Action {
  readonly type = VendorActionTypes.LoadVendor;
}

export class LoadVendorSuccess implements Action {
  readonly type = VendorActionTypes.LoadVendorSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadVendorFail implements Action {
  readonly type = VendorActionTypes.LoadVendorFail;

  constructor(public payload: string) { }
}

export class LoadVendorAll implements Action {
  readonly type = VendorActionTypes.LoadVendorAll;
}

export class LoadVendorAllSuccess implements Action {
  readonly type = VendorActionTypes.LoadVendorAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadVendorAllFail implements Action {
  readonly type = VendorActionTypes.LoadVendorAllFail;

  constructor(public payload: string) { }
}

export class CreateVendor implements Action {
  readonly type = VendorActionTypes.CreateVendor;

  constructor(public payload: Vendor) { }
}

export class CreateVendorSuccess implements Action {
  readonly type = VendorActionTypes.CreateVendorSuccess;

  constructor(public payload: Vendor) { }
}

export class CreateVendorFail implements Action {
  readonly type = VendorActionTypes.CreateVendorFail;

  constructor(public payload: string) { }
}

export class UpdateVendor implements Action {
  readonly type = VendorActionTypes.UpdateVendor;

  constructor(public payload: Vendor) { }
}

export class UpdateVendorSuccess implements Action {
  readonly type = VendorActionTypes.UpdateVendorSuccess;

  constructor(public payload: Vendor) { }
}

export class UpdateVendorFail implements Action {
  readonly type = VendorActionTypes.UpdateVendorFail;

  constructor(public payload: string) { }
}

export class DeleteVendor implements Action {
  readonly type = VendorActionTypes.DeleteVendor;

  constructor(public payload: number) { }
}

export class DeleteVendorSuccess implements Action {
  readonly type = VendorActionTypes.DeleteVendorSuccess;

  constructor(public payload: number) { }
}

export class DeleteVendorFail implements Action {
  readonly type = VendorActionTypes.DeleteVendorFail;

  constructor(public payload: string) { }
}

export type VendorActions = SetCurrentVendor
  | ClearCurrentVendor
  | InitializeCurrentVendor
  | SetVendorDataSourceParameters
  | LoadVendor
  | LoadVendorSuccess
  | LoadVendorFail
  | LoadVendorAll
  | LoadVendorAllSuccess
  | LoadVendorAllFail
  | CreateVendor
  | CreateVendorSuccess
  | CreateVendorFail
  | UpdateVendor
  | UpdateVendorSuccess
  | UpdateVendorFail
  | DeleteVendor
  | DeleteVendorSuccess
  | DeleteVendorFail;
