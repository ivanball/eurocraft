import { UnitMeasure } from '../../models/unitmeasure';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum UnitMeasureActionTypes {
  SetCurrentUnitMeasure = '[Core] Set Current UnitMeasure',
  ClearCurrentUnitMeasure = '[Core] Clear Current UnitMeasure',
  InitializeCurrentUnitMeasure = '[Core] Initialize Current UnitMeasure',
  SetUnitMeasureDataSourceParameters = '[Core] Set UnitMeasure DataSource Parameters',
  LoadUnitMeasure = '[Core] Load UnitMeasure',
  LoadUnitMeasureSuccess = '[Core] Load UnitMeasure Success',
  LoadUnitMeasureFail = '[Core] Load UnitMeasure Fail',
  LoadUnitMeasureAll = '[Core] Load UnitMeasure All',
  LoadUnitMeasureAllSuccess = '[Core] Load UnitMeasure All Success',
  LoadUnitMeasureAllFail = '[Core] Load UnitMeasure All Fail',
  CreateUnitMeasure = '[Core] Create UnitMeasure',
  CreateUnitMeasureSuccess = '[Core] Create UnitMeasure Success',
  CreateUnitMeasureFail = '[Core] Create UnitMeasure Fail',
  UpdateUnitMeasure = '[Core] Update UnitMeasure',
  UpdateUnitMeasureSuccess = '[Core] Update UnitMeasure Success',
  UpdateUnitMeasureFail = '[Core] Update UnitMeasure Fail',
  DeleteUnitMeasure = '[Core] Delete UnitMeasure',
  DeleteUnitMeasureSuccess = '[Core] Delete UnitMeasure Success',
  DeleteUnitMeasureFail = '[Core] Delete UnitMeasure Fail',
}

export class SetCurrentUnitMeasure implements Action {
  readonly type = UnitMeasureActionTypes.SetCurrentUnitMeasure;

  constructor(public payload: UnitMeasure) { }
}

export class ClearCurrentUnitMeasure implements Action {
  readonly type = UnitMeasureActionTypes.ClearCurrentUnitMeasure;
}

export class InitializeCurrentUnitMeasure implements Action {
  readonly type = UnitMeasureActionTypes.InitializeCurrentUnitMeasure;
}

export class SetUnitMeasureDataSourceParameters implements Action {
  readonly type = UnitMeasureActionTypes.SetUnitMeasureDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadUnitMeasure implements Action {
  readonly type = UnitMeasureActionTypes.LoadUnitMeasure;
}

export class LoadUnitMeasureSuccess implements Action {
  readonly type = UnitMeasureActionTypes.LoadUnitMeasureSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadUnitMeasureFail implements Action {
  readonly type = UnitMeasureActionTypes.LoadUnitMeasureFail;

  constructor(public payload: string) { }
}

export class LoadUnitMeasureAll implements Action {
  readonly type = UnitMeasureActionTypes.LoadUnitMeasureAll;
}

export class LoadUnitMeasureAllSuccess implements Action {
  readonly type = UnitMeasureActionTypes.LoadUnitMeasureAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadUnitMeasureAllFail implements Action {
  readonly type = UnitMeasureActionTypes.LoadUnitMeasureAllFail;

  constructor(public payload: string) { }
}

export class CreateUnitMeasure implements Action {
  readonly type = UnitMeasureActionTypes.CreateUnitMeasure;

  constructor(public payload: UnitMeasure) { }
}

export class CreateUnitMeasureSuccess implements Action {
  readonly type = UnitMeasureActionTypes.CreateUnitMeasureSuccess;

  constructor(public payload: UnitMeasure) { }
}

export class CreateUnitMeasureFail implements Action {
  readonly type = UnitMeasureActionTypes.CreateUnitMeasureFail;

  constructor(public payload: string) { }
}

export class UpdateUnitMeasure implements Action {
  readonly type = UnitMeasureActionTypes.UpdateUnitMeasure;

  constructor(public payload: UnitMeasure) { }
}

export class UpdateUnitMeasureSuccess implements Action {
  readonly type = UnitMeasureActionTypes.UpdateUnitMeasureSuccess;

  constructor(public payload: UnitMeasure) { }
}

export class UpdateUnitMeasureFail implements Action {
  readonly type = UnitMeasureActionTypes.UpdateUnitMeasureFail;

  constructor(public payload: string) { }
}

export class DeleteUnitMeasure implements Action {
  readonly type = UnitMeasureActionTypes.DeleteUnitMeasure;

  constructor(public payload: number) { }
}

export class DeleteUnitMeasureSuccess implements Action {
  readonly type = UnitMeasureActionTypes.DeleteUnitMeasureSuccess;

  constructor(public payload: number) { }
}

export class DeleteUnitMeasureFail implements Action {
  readonly type = UnitMeasureActionTypes.DeleteUnitMeasureFail;

  constructor(public payload: string) { }
}

export type UnitMeasureActions = SetCurrentUnitMeasure
  | ClearCurrentUnitMeasure
  | InitializeCurrentUnitMeasure
  | SetUnitMeasureDataSourceParameters
  | LoadUnitMeasure
  | LoadUnitMeasureSuccess
  | LoadUnitMeasureFail
  | LoadUnitMeasureAll
  | LoadUnitMeasureAllSuccess
  | LoadUnitMeasureAllFail
  | CreateUnitMeasure
  | CreateUnitMeasureSuccess
  | CreateUnitMeasureFail
  | UpdateUnitMeasure
  | UpdateUnitMeasureSuccess
  | UpdateUnitMeasureFail
  | DeleteUnitMeasure
  | DeleteUnitMeasureSuccess
  | DeleteUnitMeasureFail;
