import { SalesOrderDetail } from '../../models/salesorderdetail';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum SalesOrderDetailActionTypes {
  SetCurrentSalesOrderDetail = '[Core] Set Current SalesOrderDetail',
  ClearCurrentSalesOrderDetail = '[Core] Clear Current SalesOrderDetail',
  InitializeCurrentSalesOrderDetail = '[Core] Initialize Current SalesOrderDetail',
  SetSalesOrderDetailDataSourceParameters = '[Core] Set SalesOrderDetail DataSource Parameters',
  LoadSalesOrderDetail = '[Core] Load SalesOrderDetail',
  LoadSalesOrderDetailSuccess = '[Core] Load SalesOrderDetail Success',
  LoadSalesOrderDetailFail = '[Core] Load SalesOrderDetail Fail',
  LoadSalesOrderDetailAll = '[Core] Load SalesOrderDetail All',
  LoadSalesOrderDetailAllSuccess = '[Core] Load SalesOrderDetail All Success',
  LoadSalesOrderDetailAllFail = '[Core] Load SalesOrderDetail All Fail',
  CreateSalesOrderDetail = '[Core] Create SalesOrderDetail',
  CreateSalesOrderDetailSuccess = '[Core] Create SalesOrderDetail Success',
  CreateSalesOrderDetailFail = '[Core] Create SalesOrderDetail Fail',
  UpdateSalesOrderDetail = '[Core] Update SalesOrderDetail',
  UpdateSalesOrderDetailSuccess = '[Core] Update SalesOrderDetail Success',
  UpdateSalesOrderDetailFail = '[Core] Update SalesOrderDetail Fail',
  DeleteSalesOrderDetail = '[Core] Delete SalesOrderDetail',
  DeleteSalesOrderDetailSuccess = '[Core] Delete SalesOrderDetail Success',
  DeleteSalesOrderDetailFail = '[Core] Delete SalesOrderDetail Fail',
}

export class SetCurrentSalesOrderDetail implements Action {
  readonly type = SalesOrderDetailActionTypes.SetCurrentSalesOrderDetail;

  constructor(public payload: SalesOrderDetail) { }
}

export class ClearCurrentSalesOrderDetail implements Action {
  readonly type = SalesOrderDetailActionTypes.ClearCurrentSalesOrderDetail;
}

export class InitializeCurrentSalesOrderDetail implements Action {
  readonly type = SalesOrderDetailActionTypes.InitializeCurrentSalesOrderDetail;
}

export class SetSalesOrderDetailDataSourceParameters implements Action {
  readonly type = SalesOrderDetailActionTypes.SetSalesOrderDetailDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadSalesOrderDetail implements Action {
  readonly type = SalesOrderDetailActionTypes.LoadSalesOrderDetail;
}

export class LoadSalesOrderDetailSuccess implements Action {
  readonly type = SalesOrderDetailActionTypes.LoadSalesOrderDetailSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadSalesOrderDetailFail implements Action {
  readonly type = SalesOrderDetailActionTypes.LoadSalesOrderDetailFail;

  constructor(public payload: string) { }
}

export class LoadSalesOrderDetailAll implements Action {
  readonly type = SalesOrderDetailActionTypes.LoadSalesOrderDetailAll;
}

export class LoadSalesOrderDetailAllSuccess implements Action {
  readonly type = SalesOrderDetailActionTypes.LoadSalesOrderDetailAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadSalesOrderDetailAllFail implements Action {
  readonly type = SalesOrderDetailActionTypes.LoadSalesOrderDetailAllFail;

  constructor(public payload: string) { }
}

export class CreateSalesOrderDetail implements Action {
  readonly type = SalesOrderDetailActionTypes.CreateSalesOrderDetail;

  constructor(public payload: SalesOrderDetail) { }
}

export class CreateSalesOrderDetailSuccess implements Action {
  readonly type = SalesOrderDetailActionTypes.CreateSalesOrderDetailSuccess;

  constructor(public payload: SalesOrderDetail) { }
}

export class CreateSalesOrderDetailFail implements Action {
  readonly type = SalesOrderDetailActionTypes.CreateSalesOrderDetailFail;

  constructor(public payload: string) { }
}

export class UpdateSalesOrderDetail implements Action {
  readonly type = SalesOrderDetailActionTypes.UpdateSalesOrderDetail;

  constructor(public payload: SalesOrderDetail) { }
}

export class UpdateSalesOrderDetailSuccess implements Action {
  readonly type = SalesOrderDetailActionTypes.UpdateSalesOrderDetailSuccess;

  constructor(public payload: SalesOrderDetail) { }
}

export class UpdateSalesOrderDetailFail implements Action {
  readonly type = SalesOrderDetailActionTypes.UpdateSalesOrderDetailFail;

  constructor(public payload: string) { }
}

export class DeleteSalesOrderDetail implements Action {
  readonly type = SalesOrderDetailActionTypes.DeleteSalesOrderDetail;

  constructor(public payload: number) { }
}

export class DeleteSalesOrderDetailSuccess implements Action {
  readonly type = SalesOrderDetailActionTypes.DeleteSalesOrderDetailSuccess;

  constructor(public payload: number) { }
}

export class DeleteSalesOrderDetailFail implements Action {
  readonly type = SalesOrderDetailActionTypes.DeleteSalesOrderDetailFail;

  constructor(public payload: string) { }
}

export type SalesOrderDetailActions = SetCurrentSalesOrderDetail
  | ClearCurrentSalesOrderDetail
  | InitializeCurrentSalesOrderDetail
  | SetSalesOrderDetailDataSourceParameters
  | LoadSalesOrderDetail
  | LoadSalesOrderDetailSuccess
  | LoadSalesOrderDetailFail
  | LoadSalesOrderDetailAll
  | LoadSalesOrderDetailAllSuccess
  | LoadSalesOrderDetailAllFail
  | CreateSalesOrderDetail
  | CreateSalesOrderDetailSuccess
  | CreateSalesOrderDetailFail
  | UpdateSalesOrderDetail
  | UpdateSalesOrderDetailSuccess
  | UpdateSalesOrderDetailFail
  | DeleteSalesOrderDetail
  | DeleteSalesOrderDetailSuccess
  | DeleteSalesOrderDetailFail;
