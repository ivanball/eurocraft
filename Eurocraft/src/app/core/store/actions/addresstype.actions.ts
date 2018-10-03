import { AddressType } from '../../models/addresstype';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum AddressTypeActionTypes {
  SetCurrentAddressType = '[Core] Set Current AddressType',
  ClearCurrentAddressType = '[Core] Clear Current AddressType',
  InitializeCurrentAddressType = '[Core] Initialize Current AddressType',
  SetAddressTypeDataSourceParameters = '[Core] Set AddressType DataSource Parameters',
  LoadAddressType = '[Core] Load AddressType',
  LoadAddressTypeSuccess = '[Core] Load AddressType Success',
  LoadAddressTypeFail = '[Core] Load AddressType Fail',
  LoadAddressTypeAll = '[Core] Load AddressType All',
  LoadAddressTypeAllSuccess = '[Core] Load AddressType All Success',
  LoadAddressTypeAllFail = '[Core] Load AddressType All Fail',
  CreateAddressType = '[Core] Create AddressType',
  CreateAddressTypeSuccess = '[Core] Create AddressType Success',
  CreateAddressTypeFail = '[Core] Create AddressType Fail',
  UpdateAddressType = '[Core] Update AddressType',
  UpdateAddressTypeSuccess = '[Core] Update AddressType Success',
  UpdateAddressTypeFail = '[Core] Update AddressType Fail',
  DeleteAddressType = '[Core] Delete AddressType',
  DeleteAddressTypeSuccess = '[Core] Delete AddressType Success',
  DeleteAddressTypeFail = '[Core] Delete AddressType Fail',
}

export class SetCurrentAddressType implements Action {
  readonly type = AddressTypeActionTypes.SetCurrentAddressType;

  constructor(public payload: AddressType) { }
}

export class ClearCurrentAddressType implements Action {
  readonly type = AddressTypeActionTypes.ClearCurrentAddressType;
}

export class InitializeCurrentAddressType implements Action {
  readonly type = AddressTypeActionTypes.InitializeCurrentAddressType;
}

export class SetAddressTypeDataSourceParameters implements Action {
  readonly type = AddressTypeActionTypes.SetAddressTypeDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadAddressType implements Action {
  readonly type = AddressTypeActionTypes.LoadAddressType;
}

export class LoadAddressTypeSuccess implements Action {
  readonly type = AddressTypeActionTypes.LoadAddressTypeSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadAddressTypeFail implements Action {
  readonly type = AddressTypeActionTypes.LoadAddressTypeFail;

  constructor(public payload: string) { }
}

export class LoadAddressTypeAll implements Action {
  readonly type = AddressTypeActionTypes.LoadAddressTypeAll;
}

export class LoadAddressTypeAllSuccess implements Action {
  readonly type = AddressTypeActionTypes.LoadAddressTypeAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadAddressTypeAllFail implements Action {
  readonly type = AddressTypeActionTypes.LoadAddressTypeAllFail;

  constructor(public payload: string) { }
}

export class CreateAddressType implements Action {
  readonly type = AddressTypeActionTypes.CreateAddressType;

  constructor(public payload: AddressType) { }
}

export class CreateAddressTypeSuccess implements Action {
  readonly type = AddressTypeActionTypes.CreateAddressTypeSuccess;

  constructor(public payload: AddressType) { }
}

export class CreateAddressTypeFail implements Action {
  readonly type = AddressTypeActionTypes.CreateAddressTypeFail;

  constructor(public payload: string) { }
}

export class UpdateAddressType implements Action {
  readonly type = AddressTypeActionTypes.UpdateAddressType;

  constructor(public payload: AddressType) { }
}

export class UpdateAddressTypeSuccess implements Action {
  readonly type = AddressTypeActionTypes.UpdateAddressTypeSuccess;

  constructor(public payload: AddressType) { }
}

export class UpdateAddressTypeFail implements Action {
  readonly type = AddressTypeActionTypes.UpdateAddressTypeFail;

  constructor(public payload: string) { }
}

export class DeleteAddressType implements Action {
  readonly type = AddressTypeActionTypes.DeleteAddressType;

  constructor(public payload: number) { }
}

export class DeleteAddressTypeSuccess implements Action {
  readonly type = AddressTypeActionTypes.DeleteAddressTypeSuccess;

  constructor(public payload: number) { }
}

export class DeleteAddressTypeFail implements Action {
  readonly type = AddressTypeActionTypes.DeleteAddressTypeFail;

  constructor(public payload: string) { }
}

export type AddressTypeActions = SetCurrentAddressType
  | ClearCurrentAddressType
  | InitializeCurrentAddressType
  | SetAddressTypeDataSourceParameters
  | LoadAddressType
  | LoadAddressTypeSuccess
  | LoadAddressTypeFail
  | LoadAddressTypeAll
  | LoadAddressTypeAllSuccess
  | LoadAddressTypeAllFail
  | CreateAddressType
  | CreateAddressTypeSuccess
  | CreateAddressTypeFail
  | UpdateAddressType
  | UpdateAddressTypeSuccess
  | UpdateAddressTypeFail
  | DeleteAddressType
  | DeleteAddressTypeSuccess
  | DeleteAddressTypeFail;
