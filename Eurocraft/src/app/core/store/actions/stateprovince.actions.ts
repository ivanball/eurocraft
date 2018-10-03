import { StateProvince } from '../../models/stateprovince';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum StateProvinceActionTypes {
  SetCurrentStateProvince = '[Core] Set Current StateProvince',
  ClearCurrentStateProvince = '[Core] Clear Current StateProvince',
  InitializeCurrentStateProvince = '[Core] Initialize Current StateProvince',
  SetStateProvinceDataSourceParameters = '[Core] Set StateProvince DataSource Parameters',
  LoadStateProvince = '[Core] Load StateProvince',
  LoadStateProvinceSuccess = '[Core] Load StateProvince Success',
  LoadStateProvinceFail = '[Core] Load StateProvince Fail',
  LoadStateProvinceAll = '[Core] Load StateProvince All',
  LoadStateProvinceAllSuccess = '[Core] Load StateProvince All Success',
  LoadStateProvinceAllFail = '[Core] Load StateProvince All Fail',
  CreateStateProvince = '[Core] Create StateProvince',
  CreateStateProvinceSuccess = '[Core] Create StateProvince Success',
  CreateStateProvinceFail = '[Core] Create StateProvince Fail',
  UpdateStateProvince = '[Core] Update StateProvince',
  UpdateStateProvinceSuccess = '[Core] Update StateProvince Success',
  UpdateStateProvinceFail = '[Core] Update StateProvince Fail',
  DeleteStateProvince = '[Core] Delete StateProvince',
  DeleteStateProvinceSuccess = '[Core] Delete StateProvince Success',
  DeleteStateProvinceFail = '[Core] Delete StateProvince Fail',
}

export class SetCurrentStateProvince implements Action {
  readonly type = StateProvinceActionTypes.SetCurrentStateProvince;

  constructor(public payload: StateProvince) { }
}

export class ClearCurrentStateProvince implements Action {
  readonly type = StateProvinceActionTypes.ClearCurrentStateProvince;
}

export class InitializeCurrentStateProvince implements Action {
  readonly type = StateProvinceActionTypes.InitializeCurrentStateProvince;
}

export class SetStateProvinceDataSourceParameters implements Action {
  readonly type = StateProvinceActionTypes.SetStateProvinceDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadStateProvince implements Action {
  readonly type = StateProvinceActionTypes.LoadStateProvince;
}

export class LoadStateProvinceSuccess implements Action {
  readonly type = StateProvinceActionTypes.LoadStateProvinceSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadStateProvinceFail implements Action {
  readonly type = StateProvinceActionTypes.LoadStateProvinceFail;

  constructor(public payload: string) { }
}

export class LoadStateProvinceAll implements Action {
  readonly type = StateProvinceActionTypes.LoadStateProvinceAll;
}

export class LoadStateProvinceAllSuccess implements Action {
  readonly type = StateProvinceActionTypes.LoadStateProvinceAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadStateProvinceAllFail implements Action {
  readonly type = StateProvinceActionTypes.LoadStateProvinceAllFail;

  constructor(public payload: string) { }
}

export class CreateStateProvince implements Action {
  readonly type = StateProvinceActionTypes.CreateStateProvince;

  constructor(public payload: StateProvince) { }
}

export class CreateStateProvinceSuccess implements Action {
  readonly type = StateProvinceActionTypes.CreateStateProvinceSuccess;

  constructor(public payload: StateProvince) { }
}

export class CreateStateProvinceFail implements Action {
  readonly type = StateProvinceActionTypes.CreateStateProvinceFail;

  constructor(public payload: string) { }
}

export class UpdateStateProvince implements Action {
  readonly type = StateProvinceActionTypes.UpdateStateProvince;

  constructor(public payload: StateProvince) { }
}

export class UpdateStateProvinceSuccess implements Action {
  readonly type = StateProvinceActionTypes.UpdateStateProvinceSuccess;

  constructor(public payload: StateProvince) { }
}

export class UpdateStateProvinceFail implements Action {
  readonly type = StateProvinceActionTypes.UpdateStateProvinceFail;

  constructor(public payload: string) { }
}

export class DeleteStateProvince implements Action {
  readonly type = StateProvinceActionTypes.DeleteStateProvince;

  constructor(public payload: number) { }
}

export class DeleteStateProvinceSuccess implements Action {
  readonly type = StateProvinceActionTypes.DeleteStateProvinceSuccess;

  constructor(public payload: number) { }
}

export class DeleteStateProvinceFail implements Action {
  readonly type = StateProvinceActionTypes.DeleteStateProvinceFail;

  constructor(public payload: string) { }
}

export type StateProvinceActions = SetCurrentStateProvince
  | ClearCurrentStateProvince
  | InitializeCurrentStateProvince
  | SetStateProvinceDataSourceParameters
  | LoadStateProvince
  | LoadStateProvinceSuccess
  | LoadStateProvinceFail
  | LoadStateProvinceAll
  | LoadStateProvinceAllSuccess
  | LoadStateProvinceAllFail
  | CreateStateProvince
  | CreateStateProvinceSuccess
  | CreateStateProvinceFail
  | UpdateStateProvince
  | UpdateStateProvinceSuccess
  | UpdateStateProvinceFail
  | DeleteStateProvince
  | DeleteStateProvinceSuccess
  | DeleteStateProvinceFail;
