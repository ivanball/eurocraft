import { PhoneNumberType } from '../../models/phonenumbertype';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum PhoneNumberTypeActionTypes {
  SetCurrentPhoneNumberType = '[Core] Set Current PhoneNumberType',
  ClearCurrentPhoneNumberType = '[Core] Clear Current PhoneNumberType',
  InitializeCurrentPhoneNumberType = '[Core] Initialize Current PhoneNumberType',
  SetPhoneNumberTypeDataSourceParameters = '[Core] Set PhoneNumberType DataSource Parameters',
  LoadPhoneNumberType = '[Core] Load PhoneNumberType',
  LoadPhoneNumberTypeSuccess = '[Core] Load PhoneNumberType Success',
  LoadPhoneNumberTypeFail = '[Core] Load PhoneNumberType Fail',
  LoadPhoneNumberTypeAll = '[Core] Load PhoneNumberType All',
  LoadPhoneNumberTypeAllSuccess = '[Core] Load PhoneNumberType All Success',
  LoadPhoneNumberTypeAllFail = '[Core] Load PhoneNumberType All Fail',
  CreatePhoneNumberType = '[Core] Create PhoneNumberType',
  CreatePhoneNumberTypeSuccess = '[Core] Create PhoneNumberType Success',
  CreatePhoneNumberTypeFail = '[Core] Create PhoneNumberType Fail',
  UpdatePhoneNumberType = '[Core] Update PhoneNumberType',
  UpdatePhoneNumberTypeSuccess = '[Core] Update PhoneNumberType Success',
  UpdatePhoneNumberTypeFail = '[Core] Update PhoneNumberType Fail',
  DeletePhoneNumberType = '[Core] Delete PhoneNumberType',
  DeletePhoneNumberTypeSuccess = '[Core] Delete PhoneNumberType Success',
  DeletePhoneNumberTypeFail = '[Core] Delete PhoneNumberType Fail',
}

export class SetCurrentPhoneNumberType implements Action {
  readonly type = PhoneNumberTypeActionTypes.SetCurrentPhoneNumberType;

  constructor(public payload: PhoneNumberType) { }
}

export class ClearCurrentPhoneNumberType implements Action {
  readonly type = PhoneNumberTypeActionTypes.ClearCurrentPhoneNumberType;
}

export class InitializeCurrentPhoneNumberType implements Action {
  readonly type = PhoneNumberTypeActionTypes.InitializeCurrentPhoneNumberType;
}

export class SetPhoneNumberTypeDataSourceParameters implements Action {
  readonly type = PhoneNumberTypeActionTypes.SetPhoneNumberTypeDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadPhoneNumberType implements Action {
  readonly type = PhoneNumberTypeActionTypes.LoadPhoneNumberType;
}

export class LoadPhoneNumberTypeSuccess implements Action {
  readonly type = PhoneNumberTypeActionTypes.LoadPhoneNumberTypeSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadPhoneNumberTypeFail implements Action {
  readonly type = PhoneNumberTypeActionTypes.LoadPhoneNumberTypeFail;

  constructor(public payload: string) { }
}

export class LoadPhoneNumberTypeAll implements Action {
  readonly type = PhoneNumberTypeActionTypes.LoadPhoneNumberTypeAll;
}

export class LoadPhoneNumberTypeAllSuccess implements Action {
  readonly type = PhoneNumberTypeActionTypes.LoadPhoneNumberTypeAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadPhoneNumberTypeAllFail implements Action {
  readonly type = PhoneNumberTypeActionTypes.LoadPhoneNumberTypeAllFail;

  constructor(public payload: string) { }
}

export class CreatePhoneNumberType implements Action {
  readonly type = PhoneNumberTypeActionTypes.CreatePhoneNumberType;

  constructor(public payload: PhoneNumberType) { }
}

export class CreatePhoneNumberTypeSuccess implements Action {
  readonly type = PhoneNumberTypeActionTypes.CreatePhoneNumberTypeSuccess;

  constructor(public payload: PhoneNumberType) { }
}

export class CreatePhoneNumberTypeFail implements Action {
  readonly type = PhoneNumberTypeActionTypes.CreatePhoneNumberTypeFail;

  constructor(public payload: string) { }
}

export class UpdatePhoneNumberType implements Action {
  readonly type = PhoneNumberTypeActionTypes.UpdatePhoneNumberType;

  constructor(public payload: PhoneNumberType) { }
}

export class UpdatePhoneNumberTypeSuccess implements Action {
  readonly type = PhoneNumberTypeActionTypes.UpdatePhoneNumberTypeSuccess;

  constructor(public payload: PhoneNumberType) { }
}

export class UpdatePhoneNumberTypeFail implements Action {
  readonly type = PhoneNumberTypeActionTypes.UpdatePhoneNumberTypeFail;

  constructor(public payload: string) { }
}

export class DeletePhoneNumberType implements Action {
  readonly type = PhoneNumberTypeActionTypes.DeletePhoneNumberType;

  constructor(public payload: number) { }
}

export class DeletePhoneNumberTypeSuccess implements Action {
  readonly type = PhoneNumberTypeActionTypes.DeletePhoneNumberTypeSuccess;

  constructor(public payload: number) { }
}

export class DeletePhoneNumberTypeFail implements Action {
  readonly type = PhoneNumberTypeActionTypes.DeletePhoneNumberTypeFail;

  constructor(public payload: string) { }
}

export type PhoneNumberTypeActions = SetCurrentPhoneNumberType
  | ClearCurrentPhoneNumberType
  | InitializeCurrentPhoneNumberType
  | SetPhoneNumberTypeDataSourceParameters
  | LoadPhoneNumberType
  | LoadPhoneNumberTypeSuccess
  | LoadPhoneNumberTypeFail
  | LoadPhoneNumberTypeAll
  | LoadPhoneNumberTypeAllSuccess
  | LoadPhoneNumberTypeAllFail
  | CreatePhoneNumberType
  | CreatePhoneNumberTypeSuccess
  | CreatePhoneNumberTypeFail
  | UpdatePhoneNumberType
  | UpdatePhoneNumberTypeSuccess
  | UpdatePhoneNumberTypeFail
  | DeletePhoneNumberType
  | DeletePhoneNumberTypeSuccess
  | DeletePhoneNumberTypeFail;
