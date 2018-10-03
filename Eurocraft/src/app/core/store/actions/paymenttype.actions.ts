import { PaymentType } from '../../models/paymenttype';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum PaymentTypeActionTypes {
  SetCurrentPaymentType = '[Core] Set Current PaymentType',
  ClearCurrentPaymentType = '[Core] Clear Current PaymentType',
  InitializeCurrentPaymentType = '[Core] Initialize Current PaymentType',
  SetPaymentTypeDataSourceParameters = '[Core] Set PaymentType DataSource Parameters',
  LoadPaymentType = '[Core] Load PaymentType',
  LoadPaymentTypeSuccess = '[Core] Load PaymentType Success',
  LoadPaymentTypeFail = '[Core] Load PaymentType Fail',
  LoadPaymentTypeAll = '[Core] Load PaymentType All',
  LoadPaymentTypeAllSuccess = '[Core] Load PaymentType All Success',
  LoadPaymentTypeAllFail = '[Core] Load PaymentType All Fail',
  CreatePaymentType = '[Core] Create PaymentType',
  CreatePaymentTypeSuccess = '[Core] Create PaymentType Success',
  CreatePaymentTypeFail = '[Core] Create PaymentType Fail',
  UpdatePaymentType = '[Core] Update PaymentType',
  UpdatePaymentTypeSuccess = '[Core] Update PaymentType Success',
  UpdatePaymentTypeFail = '[Core] Update PaymentType Fail',
  DeletePaymentType = '[Core] Delete PaymentType',
  DeletePaymentTypeSuccess = '[Core] Delete PaymentType Success',
  DeletePaymentTypeFail = '[Core] Delete PaymentType Fail',
}

export class SetCurrentPaymentType implements Action {
  readonly type = PaymentTypeActionTypes.SetCurrentPaymentType;

  constructor(public payload: PaymentType) { }
}

export class ClearCurrentPaymentType implements Action {
  readonly type = PaymentTypeActionTypes.ClearCurrentPaymentType;
}

export class InitializeCurrentPaymentType implements Action {
  readonly type = PaymentTypeActionTypes.InitializeCurrentPaymentType;
}

export class SetPaymentTypeDataSourceParameters implements Action {
  readonly type = PaymentTypeActionTypes.SetPaymentTypeDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadPaymentType implements Action {
  readonly type = PaymentTypeActionTypes.LoadPaymentType;
}

export class LoadPaymentTypeSuccess implements Action {
  readonly type = PaymentTypeActionTypes.LoadPaymentTypeSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadPaymentTypeFail implements Action {
  readonly type = PaymentTypeActionTypes.LoadPaymentTypeFail;

  constructor(public payload: string) { }
}

export class LoadPaymentTypeAll implements Action {
  readonly type = PaymentTypeActionTypes.LoadPaymentTypeAll;
}

export class LoadPaymentTypeAllSuccess implements Action {
  readonly type = PaymentTypeActionTypes.LoadPaymentTypeAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadPaymentTypeAllFail implements Action {
  readonly type = PaymentTypeActionTypes.LoadPaymentTypeAllFail;

  constructor(public payload: string) { }
}

export class CreatePaymentType implements Action {
  readonly type = PaymentTypeActionTypes.CreatePaymentType;

  constructor(public payload: PaymentType) { }
}

export class CreatePaymentTypeSuccess implements Action {
  readonly type = PaymentTypeActionTypes.CreatePaymentTypeSuccess;

  constructor(public payload: PaymentType) { }
}

export class CreatePaymentTypeFail implements Action {
  readonly type = PaymentTypeActionTypes.CreatePaymentTypeFail;

  constructor(public payload: string) { }
}

export class UpdatePaymentType implements Action {
  readonly type = PaymentTypeActionTypes.UpdatePaymentType;

  constructor(public payload: PaymentType) { }
}

export class UpdatePaymentTypeSuccess implements Action {
  readonly type = PaymentTypeActionTypes.UpdatePaymentTypeSuccess;

  constructor(public payload: PaymentType) { }
}

export class UpdatePaymentTypeFail implements Action {
  readonly type = PaymentTypeActionTypes.UpdatePaymentTypeFail;

  constructor(public payload: string) { }
}

export class DeletePaymentType implements Action {
  readonly type = PaymentTypeActionTypes.DeletePaymentType;

  constructor(public payload: number) { }
}

export class DeletePaymentTypeSuccess implements Action {
  readonly type = PaymentTypeActionTypes.DeletePaymentTypeSuccess;

  constructor(public payload: number) { }
}

export class DeletePaymentTypeFail implements Action {
  readonly type = PaymentTypeActionTypes.DeletePaymentTypeFail;

  constructor(public payload: string) { }
}

export type PaymentTypeActions = SetCurrentPaymentType
  | ClearCurrentPaymentType
  | InitializeCurrentPaymentType
  | SetPaymentTypeDataSourceParameters
  | LoadPaymentType
  | LoadPaymentTypeSuccess
  | LoadPaymentTypeFail
  | LoadPaymentTypeAll
  | LoadPaymentTypeAllSuccess
  | LoadPaymentTypeAllFail
  | CreatePaymentType
  | CreatePaymentTypeSuccess
  | CreatePaymentTypeFail
  | UpdatePaymentType
  | UpdatePaymentTypeSuccess
  | UpdatePaymentTypeFail
  | DeletePaymentType
  | DeletePaymentTypeSuccess
  | DeletePaymentTypeFail;
