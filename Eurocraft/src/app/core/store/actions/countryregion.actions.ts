import { CountryRegion } from '../../models/countryregion';

import { Action } from '@ngrx/store';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

export enum CountryRegionActionTypes {
  SetCurrentCountryRegion = '[Core] Set Current CountryRegion',
  ClearCurrentCountryRegion = '[Core] Clear Current CountryRegion',
  InitializeCurrentCountryRegion = '[Core] Initialize Current CountryRegion',
  SetCountryRegionDataSourceParameters = '[Core] Set CountryRegion DataSource Parameters',
  LoadCountryRegion = '[Core] Load CountryRegion',
  LoadCountryRegionSuccess = '[Core] Load CountryRegion Success',
  LoadCountryRegionFail = '[Core] Load CountryRegion Fail',
  LoadCountryRegionAll = '[Core] Load CountryRegion All',
  LoadCountryRegionAllSuccess = '[Core] Load CountryRegion All Success',
  LoadCountryRegionAllFail = '[Core] Load CountryRegion All Fail',
  CreateCountryRegion = '[Core] Create CountryRegion',
  CreateCountryRegionSuccess = '[Core] Create CountryRegion Success',
  CreateCountryRegionFail = '[Core] Create CountryRegion Fail',
  UpdateCountryRegion = '[Core] Update CountryRegion',
  UpdateCountryRegionSuccess = '[Core] Update CountryRegion Success',
  UpdateCountryRegionFail = '[Core] Update CountryRegion Fail',
  DeleteCountryRegion = '[Core] Delete CountryRegion',
  DeleteCountryRegionSuccess = '[Core] Delete CountryRegion Success',
  DeleteCountryRegionFail = '[Core] Delete CountryRegion Fail',
}

export class SetCurrentCountryRegion implements Action {
  readonly type = CountryRegionActionTypes.SetCurrentCountryRegion;

  constructor(public payload: CountryRegion) { }
}

export class ClearCurrentCountryRegion implements Action {
  readonly type = CountryRegionActionTypes.ClearCurrentCountryRegion;
}

export class InitializeCurrentCountryRegion implements Action {
  readonly type = CountryRegionActionTypes.InitializeCurrentCountryRegion;
}

export class SetCountryRegionDataSourceParameters implements Action {
  readonly type = CountryRegionActionTypes.SetCountryRegionDataSourceParameters;

  constructor(public payload: DataSourceParameters) { }
}

export class LoadCountryRegion implements Action {
  readonly type = CountryRegionActionTypes.LoadCountryRegion;
}

export class LoadCountryRegionSuccess implements Action {
  readonly type = CountryRegionActionTypes.LoadCountryRegionSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadCountryRegionFail implements Action {
  readonly type = CountryRegionActionTypes.LoadCountryRegionFail;

  constructor(public payload: string) { }
}

export class LoadCountryRegionAll implements Action {
  readonly type = CountryRegionActionTypes.LoadCountryRegionAll;
}

export class LoadCountryRegionAllSuccess implements Action {
  readonly type = CountryRegionActionTypes.LoadCountryRegionAllSuccess;

  constructor(public payload: any) { }  // any because odata returns the real payload inside the value property
}

export class LoadCountryRegionAllFail implements Action {
  readonly type = CountryRegionActionTypes.LoadCountryRegionAllFail;

  constructor(public payload: string) { }
}

export class CreateCountryRegion implements Action {
  readonly type = CountryRegionActionTypes.CreateCountryRegion;

  constructor(public payload: CountryRegion) { }
}

export class CreateCountryRegionSuccess implements Action {
  readonly type = CountryRegionActionTypes.CreateCountryRegionSuccess;

  constructor(public payload: CountryRegion) { }
}

export class CreateCountryRegionFail implements Action {
  readonly type = CountryRegionActionTypes.CreateCountryRegionFail;

  constructor(public payload: string) { }
}

export class UpdateCountryRegion implements Action {
  readonly type = CountryRegionActionTypes.UpdateCountryRegion;

  constructor(public payload: CountryRegion) { }
}

export class UpdateCountryRegionSuccess implements Action {
  readonly type = CountryRegionActionTypes.UpdateCountryRegionSuccess;

  constructor(public payload: CountryRegion) { }
}

export class UpdateCountryRegionFail implements Action {
  readonly type = CountryRegionActionTypes.UpdateCountryRegionFail;

  constructor(public payload: string) { }
}

export class DeleteCountryRegion implements Action {
  readonly type = CountryRegionActionTypes.DeleteCountryRegion;

  constructor(public payload: number) { }
}

export class DeleteCountryRegionSuccess implements Action {
  readonly type = CountryRegionActionTypes.DeleteCountryRegionSuccess;

  constructor(public payload: number) { }
}

export class DeleteCountryRegionFail implements Action {
  readonly type = CountryRegionActionTypes.DeleteCountryRegionFail;

  constructor(public payload: string) { }
}

export type CountryRegionActions = SetCurrentCountryRegion
  | ClearCurrentCountryRegion
  | InitializeCurrentCountryRegion
  | SetCountryRegionDataSourceParameters
  | LoadCountryRegion
  | LoadCountryRegionSuccess
  | LoadCountryRegionFail
  | LoadCountryRegionAll
  | LoadCountryRegionAllSuccess
  | LoadCountryRegionAllFail
  | CreateCountryRegion
  | CreateCountryRegionSuccess
  | CreateCountryRegionFail
  | UpdateCountryRegion
  | UpdateCountryRegionSuccess
  | UpdateCountryRegionFail
  | DeleteCountryRegion
  | DeleteCountryRegionSuccess
  | DeleteCountryRegionFail;
