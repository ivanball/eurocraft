import { SalesOrderHeader } from '../../../orders/models/salesorderheader';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum SalesOrderHeaderActionTypes {
  SetCurrentSalesOrderHeader = '[Core] Set Current SalesOrderHeader',
  ClearCurrentSalesOrderHeader = '[Core] Clear Current SalesOrderHeader',
  InitializeCurrentSalesOrderHeader = '[Core] Initialize Current SalesOrderHeader',
  SetSalesOrderHeaderDataSourceParameters = '[Core] Set SalesOrderHeader DataSource Parameters',
  LoadSalesOrderHeader = '[Core] Load SalesOrderHeader',
  LoadSalesOrderHeaderSuccess = '[Core] Load SalesOrderHeader Success',
  LoadSalesOrderHeaderFail = '[Core] Load SalesOrderHeader Fail',
  LoadSalesOrderHeaderAll = '[Core] Load SalesOrderHeader All',
  LoadSalesOrderHeaderAllSuccess = '[Core] Load SalesOrderHeader All Success',
  LoadSalesOrderHeaderAllFail = '[Core] Load SalesOrderHeader All Fail',
  CreateSalesOrderHeader = '[Core] Create SalesOrderHeader',
  CreateSalesOrderHeaderSuccess = '[Core] Create SalesOrderHeader Success',
  CreateSalesOrderHeaderFail = '[Core] Create SalesOrderHeader Fail',
  UpdateSalesOrderHeader = '[Core] Update SalesOrderHeader',
  UpdateSalesOrderHeaderSuccess = '[Core] Update SalesOrderHeader Success',
  UpdateSalesOrderHeaderFail = '[Core] Update SalesOrderHeader Fail',
  DeleteSalesOrderHeader = '[Core] Delete SalesOrderHeader',
  DeleteSalesOrderHeaderSuccess = '[Core] Delete SalesOrderHeader Success',
  DeleteSalesOrderHeaderFail = '[Core] Delete SalesOrderHeader Fail',
}

export class SetCurrentSalesOrderHeader implements Action {
  readonly type = SalesOrderHeaderActionTypes.SetCurrentSalesOrderHeader;

  constructor(public payload: SalesOrderHeader) { }
}

export class ClearCurrentSalesOrderHeader implements Action {
  readonly type = SalesOrderHeaderActionTypes.ClearCurrentSalesOrderHeader;
}

export class InitializeCurrentSalesOrderHeader implements Action {
  readonly type = SalesOrderHeaderActionTypes.InitializeCurrentSalesOrderHeader;
}

export class SetSalesOrderHeaderDataSourceParameters implements Action {
  readonly type = SalesOrderHeaderActionTypes.SetSalesOrderHeaderDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadSalesOrderHeader implements Action {
  readonly type = SalesOrderHeaderActionTypes.LoadSalesOrderHeader;
}

export class LoadSalesOrderHeaderSuccess implements Action {
  readonly type = SalesOrderHeaderActionTypes.LoadSalesOrderHeaderSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadSalesOrderHeaderFail implements Action {
  readonly type = SalesOrderHeaderActionTypes.LoadSalesOrderHeaderFail;

  constructor(public payload: string) { }
}

export class LoadSalesOrderHeaderAll implements Action {
  readonly type = SalesOrderHeaderActionTypes.LoadSalesOrderHeaderAll;
}

export class LoadSalesOrderHeaderAllSuccess implements Action {
  readonly type = SalesOrderHeaderActionTypes.LoadSalesOrderHeaderAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadSalesOrderHeaderAllFail implements Action {
  readonly type = SalesOrderHeaderActionTypes.LoadSalesOrderHeaderAllFail;

  constructor(public payload: string) { }
}

export class CreateSalesOrderHeader implements Action {
  readonly type = SalesOrderHeaderActionTypes.CreateSalesOrderHeader;

  constructor(public payload: SalesOrderHeader) { }
}

export class CreateSalesOrderHeaderSuccess implements Action {
  readonly type = SalesOrderHeaderActionTypes.CreateSalesOrderHeaderSuccess;

  constructor(public payload: SalesOrderHeader) { }
}

export class CreateSalesOrderHeaderFail implements Action {
  readonly type = SalesOrderHeaderActionTypes.CreateSalesOrderHeaderFail;

  constructor(public payload: string) { }
}

export class UpdateSalesOrderHeader implements Action {
  readonly type = SalesOrderHeaderActionTypes.UpdateSalesOrderHeader;

  constructor(public payload: SalesOrderHeader) { }
}

export class UpdateSalesOrderHeaderSuccess implements Action {
  readonly type = SalesOrderHeaderActionTypes.UpdateSalesOrderHeaderSuccess;

  constructor(public payload: SalesOrderHeader) { }
}

export class UpdateSalesOrderHeaderFail implements Action {
  readonly type = SalesOrderHeaderActionTypes.UpdateSalesOrderHeaderFail;

  constructor(public payload: string) { }
}

export class DeleteSalesOrderHeader implements Action {
  readonly type = SalesOrderHeaderActionTypes.DeleteSalesOrderHeader;

  constructor(public payload: number) { }
}

export class DeleteSalesOrderHeaderSuccess implements Action {
  readonly type = SalesOrderHeaderActionTypes.DeleteSalesOrderHeaderSuccess;

  constructor(public payload: number) { }
}

export class DeleteSalesOrderHeaderFail implements Action {
  readonly type = SalesOrderHeaderActionTypes.DeleteSalesOrderHeaderFail;

  constructor(public payload: string) { }
}

export type SalesOrderHeaderActions = SetCurrentSalesOrderHeader
  | ClearCurrentSalesOrderHeader
  | InitializeCurrentSalesOrderHeader
  | SetSalesOrderHeaderDataSourceParameters
  | LoadSalesOrderHeader
  | LoadSalesOrderHeaderSuccess
  | LoadSalesOrderHeaderFail
  | LoadSalesOrderHeaderAll
  | LoadSalesOrderHeaderAllSuccess
  | LoadSalesOrderHeaderAllFail
  | CreateSalesOrderHeader
  | CreateSalesOrderHeaderSuccess
  | CreateSalesOrderHeaderFail
  | UpdateSalesOrderHeader
  | UpdateSalesOrderHeaderSuccess
  | UpdateSalesOrderHeaderFail
  | DeleteSalesOrderHeader
  | DeleteSalesOrderHeaderSuccess
  | DeleteSalesOrderHeaderFail;
