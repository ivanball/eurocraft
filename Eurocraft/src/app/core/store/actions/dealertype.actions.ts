import { DealerType } from '../../models/dealertype';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum DealerTypeActionTypes {
  SetCurrentDealerType = '[Core] Set Current DealerType',
  ClearCurrentDealerType = '[Core] Clear Current DealerType',
  InitializeCurrentDealerType = '[Core] Initialize Current DealerType',
  SetDealerTypeDataSourceParameters = '[Core] Set DealerType DataSource Parameters',
  LoadDealerType = '[Core] Load DealerType',
  LoadDealerTypeSuccess = '[Core] Load DealerType Success',
  LoadDealerTypeFail = '[Core] Load DealerType Fail',
  LoadDealerTypeAll = '[Core] Load DealerType All',
  LoadDealerTypeAllSuccess = '[Core] Load DealerType All Success',
  LoadDealerTypeAllFail = '[Core] Load DealerType All Fail',
  CreateDealerType = '[Core] Create DealerType',
  CreateDealerTypeSuccess = '[Core] Create DealerType Success',
  CreateDealerTypeFail = '[Core] Create DealerType Fail',
  UpdateDealerType = '[Core] Update DealerType',
  UpdateDealerTypeSuccess = '[Core] Update DealerType Success',
  UpdateDealerTypeFail = '[Core] Update DealerType Fail',
  DeleteDealerType = '[Core] Delete DealerType',
  DeleteDealerTypeSuccess = '[Core] Delete DealerType Success',
  DeleteDealerTypeFail = '[Core] Delete DealerType Fail',
}

export class SetCurrentDealerType implements Action {
  readonly type = DealerTypeActionTypes.SetCurrentDealerType;

  constructor(public payload: DealerType) { }
}

export class ClearCurrentDealerType implements Action {
  readonly type = DealerTypeActionTypes.ClearCurrentDealerType;
}

export class InitializeCurrentDealerType implements Action {
  readonly type = DealerTypeActionTypes.InitializeCurrentDealerType;
}

export class SetDealerTypeDataSourceParameters implements Action {
  readonly type = DealerTypeActionTypes.SetDealerTypeDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadDealerType implements Action {
  readonly type = DealerTypeActionTypes.LoadDealerType;
}

export class LoadDealerTypeSuccess implements Action {
  readonly type = DealerTypeActionTypes.LoadDealerTypeSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadDealerTypeFail implements Action {
  readonly type = DealerTypeActionTypes.LoadDealerTypeFail;

  constructor(public payload: string) { }
}

export class LoadDealerTypeAll implements Action {
  readonly type = DealerTypeActionTypes.LoadDealerTypeAll;
}

export class LoadDealerTypeAllSuccess implements Action {
  readonly type = DealerTypeActionTypes.LoadDealerTypeAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadDealerTypeAllFail implements Action {
  readonly type = DealerTypeActionTypes.LoadDealerTypeAllFail;

  constructor(public payload: string) { }
}

export class CreateDealerType implements Action {
  readonly type = DealerTypeActionTypes.CreateDealerType;

  constructor(public payload: DealerType) { }
}

export class CreateDealerTypeSuccess implements Action {
  readonly type = DealerTypeActionTypes.CreateDealerTypeSuccess;

  constructor(public payload: DealerType) { }
}

export class CreateDealerTypeFail implements Action {
  readonly type = DealerTypeActionTypes.CreateDealerTypeFail;

  constructor(public payload: string) { }
}

export class UpdateDealerType implements Action {
  readonly type = DealerTypeActionTypes.UpdateDealerType;

  constructor(public payload: DealerType) { }
}

export class UpdateDealerTypeSuccess implements Action {
  readonly type = DealerTypeActionTypes.UpdateDealerTypeSuccess;

  constructor(public payload: DealerType) { }
}

export class UpdateDealerTypeFail implements Action {
  readonly type = DealerTypeActionTypes.UpdateDealerTypeFail;

  constructor(public payload: string) { }
}

export class DeleteDealerType implements Action {
  readonly type = DealerTypeActionTypes.DeleteDealerType;

  constructor(public payload: number) { }
}

export class DeleteDealerTypeSuccess implements Action {
  readonly type = DealerTypeActionTypes.DeleteDealerTypeSuccess;

  constructor(public payload: number) { }
}

export class DeleteDealerTypeFail implements Action {
  readonly type = DealerTypeActionTypes.DeleteDealerTypeFail;

  constructor(public payload: string) { }
}

export type DealerTypeActions = SetCurrentDealerType
  | ClearCurrentDealerType
  | InitializeCurrentDealerType
  | SetDealerTypeDataSourceParameters
  | LoadDealerType
  | LoadDealerTypeSuccess
  | LoadDealerTypeFail
  | LoadDealerTypeAll
  | LoadDealerTypeAllSuccess
  | LoadDealerTypeAllFail
  | CreateDealerType
  | CreateDealerTypeSuccess
  | CreateDealerTypeFail
  | UpdateDealerType
  | UpdateDealerTypeSuccess
  | UpdateDealerTypeFail
  | DeleteDealerType
  | DeleteDealerTypeSuccess
  | DeleteDealerTypeFail;
