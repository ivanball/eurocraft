import { Dealer } from '../../models/dealer';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum DealerActionTypes {
  SetCurrentDealer = '[Core] Set Current Dealer',
  ClearCurrentDealer = '[Core] Clear Current Dealer',
  InitializeCurrentDealer = '[Core] Initialize Current Dealer',
  SetDealerDataSourceParameters = '[Core] Set Dealer DataSource Parameters',
  LoadDealer = '[Core] Load Dealer',
  LoadDealerSuccess = '[Core] Load Dealer Success',
  LoadDealerFail = '[Core] Load Dealer Fail',
  LoadDealerAll = '[Core] Load Dealer All',
  LoadDealerAllSuccess = '[Core] Load Dealer All Success',
  LoadDealerAllFail = '[Core] Load Dealer All Fail',
  CreateDealer = '[Core] Create Dealer',
  CreateDealerSuccess = '[Core] Create Dealer Success',
  CreateDealerFail = '[Core] Create Dealer Fail',
  UpdateDealer = '[Core] Update Dealer',
  UpdateDealerSuccess = '[Core] Update Dealer Success',
  UpdateDealerFail = '[Core] Update Dealer Fail',
  DeleteDealer = '[Core] Delete Dealer',
  DeleteDealerSuccess = '[Core] Delete Dealer Success',
  DeleteDealerFail = '[Core] Delete Dealer Fail',
}

export class SetCurrentDealer implements Action {
  readonly type = DealerActionTypes.SetCurrentDealer;

  constructor(public payload: Dealer) { }
}

export class ClearCurrentDealer implements Action {
  readonly type = DealerActionTypes.ClearCurrentDealer;
}

export class InitializeCurrentDealer implements Action {
  readonly type = DealerActionTypes.InitializeCurrentDealer;
}

export class SetDealerDataSourceParameters implements Action {
  readonly type = DealerActionTypes.SetDealerDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadDealer implements Action {
  readonly type = DealerActionTypes.LoadDealer;
}

export class LoadDealerSuccess implements Action {
  readonly type = DealerActionTypes.LoadDealerSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadDealerFail implements Action {
  readonly type = DealerActionTypes.LoadDealerFail;

  constructor(public payload: string) { }
}

export class LoadDealerAll implements Action {
  readonly type = DealerActionTypes.LoadDealerAll;
}

export class LoadDealerAllSuccess implements Action {
  readonly type = DealerActionTypes.LoadDealerAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadDealerAllFail implements Action {
  readonly type = DealerActionTypes.LoadDealerAllFail;

  constructor(public payload: string) { }
}

export class CreateDealer implements Action {
  readonly type = DealerActionTypes.CreateDealer;

  constructor(public payload: Dealer) { }
}

export class CreateDealerSuccess implements Action {
  readonly type = DealerActionTypes.CreateDealerSuccess;

  constructor(public payload: Dealer) { }
}

export class CreateDealerFail implements Action {
  readonly type = DealerActionTypes.CreateDealerFail;

  constructor(public payload: string) { }
}

export class UpdateDealer implements Action {
  readonly type = DealerActionTypes.UpdateDealer;

  constructor(public payload: Dealer) { }
}

export class UpdateDealerSuccess implements Action {
  readonly type = DealerActionTypes.UpdateDealerSuccess;

  constructor(public payload: Dealer) { }
}

export class UpdateDealerFail implements Action {
  readonly type = DealerActionTypes.UpdateDealerFail;

  constructor(public payload: string) { }
}

export class DeleteDealer implements Action {
  readonly type = DealerActionTypes.DeleteDealer;

  constructor(public payload: number) { }
}

export class DeleteDealerSuccess implements Action {
  readonly type = DealerActionTypes.DeleteDealerSuccess;

  constructor(public payload: number) { }
}

export class DeleteDealerFail implements Action {
  readonly type = DealerActionTypes.DeleteDealerFail;

  constructor(public payload: string) { }
}

export type DealerActions = SetCurrentDealer
  | ClearCurrentDealer
  | InitializeCurrentDealer
  | SetDealerDataSourceParameters
  | LoadDealer
  | LoadDealerSuccess
  | LoadDealerFail
  | LoadDealerAll
  | LoadDealerAllSuccess
  | LoadDealerAllFail
  | CreateDealer
  | CreateDealerSuccess
  | CreateDealerFail
  | UpdateDealer
  | UpdateDealerSuccess
  | UpdateDealerFail
  | DeleteDealer
  | DeleteDealerSuccess
  | DeleteDealerFail;
