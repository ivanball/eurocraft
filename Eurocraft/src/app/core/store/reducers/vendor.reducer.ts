import { Vendor } from "../../models/vendor";
import { VendorActions, VendorActionTypes } from "../actions/vendor.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface VendorState {
    loaded: boolean;
    loading: boolean;
    currentVendorId: number | null;
    vendors: Vendor[];
    vendorsAll: Vendor[];
    vendorCount: number;
    vendorDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: VendorState = {
    loaded: false,
    loading: false,
    currentVendorId: null,
    vendors: [],
    vendorsAll: [],
    vendorCount: 0,
    vendorDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: VendorActions): VendorState {

    switch (action.type) {
        case VendorActionTypes.SetCurrentVendor: {
            return {
                ...state,
                currentVendorId: action.payload.BusinessEntityId,
                error: ''
            };
        }
        case VendorActionTypes.ClearCurrentVendor: {
            return {
                ...state,
                currentVendorId: null,
                error: ''
            };
        }
        case VendorActionTypes.InitializeCurrentVendor: {
            return {
                ...state,
                currentVendorId: 0,
                error: ''
            };
        }
        case VendorActionTypes.SetVendorDataSourceParameters: {
            return {
                ...state,
                vendorDataSourceParameters: action.payload
            };
        }
        case VendorActionTypes.LoadVendor: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case VendorActionTypes.LoadVendorSuccess: {
            const vendors = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                vendors,
                vendorCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case VendorActionTypes.LoadVendorFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                vendors: [],
                vendorCount: 0,
                error: action.payload
            };
        }
        case VendorActionTypes.LoadVendorAll: {
            return {
                ...state,
            };
        }
        case VendorActionTypes.LoadVendorAllSuccess: {
            const vendors = action.payload.value;
            return {
                ...state,
                vendorsAll: vendors,
            };
        }
        case VendorActionTypes.LoadVendorAllFail: {
            return {
                ...state,
                vendorsAll: [],
            };
        }
        case VendorActionTypes.CreateVendorSuccess: {
            const vendor = action.payload;
            return {
                ...state,
                vendors: [...state.vendors, vendor],
                currentVendorId: vendor.BusinessEntityId,
                actionSucceeded: true,
                error: ''
            };
        }
        case VendorActionTypes.CreateVendorFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case VendorActionTypes.UpdateVendorSuccess: {
            const vendor = action.payload;
            const updatedVendors = state.vendors.map(
                item => vendor.BusinessEntityId === item.BusinessEntityId ? vendor : item);

            return {
                ...state,
                vendors: updatedVendors,
                currentVendorId: vendor.BusinessEntityId,
                actionSucceeded: true,
                error: ''
            };
        }
        case VendorActionTypes.UpdateVendorFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case VendorActionTypes.DeleteVendorSuccess: {
            return {
                ...state,
                vendors: state.vendors.filter(vendor => vendor.BusinessEntityId !== action.payload),
                currentVendorId: null,
                vendorDataSourceParameters: new DataSourceParameters(
                    state.vendorDataSourceParameters.sortColumn,
                    state.vendorDataSourceParameters.sortDirection,
                    0,
                    state.vendorDataSourceParameters.pageSize,
                    state.vendorDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case VendorActionTypes.DeleteVendorFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        default: {
            return state;
        }
    }
}

export const getVendorLoaded = (state: VendorState) => state.loaded;
export const getVendorLoading = (state: VendorState) => state.loading;
export const getCurrentVendorId = (state: VendorState) => state.currentVendorId;
export const getVendors = (state: VendorState) => state.vendors;
export const getVendorsAll = (state: VendorState) => state.vendorsAll;
export const getVendorCount = (state: VendorState) => state.vendorCount;
export const getVendorDataSourceParameters = (state: VendorState) => state.vendorDataSourceParameters;
export const getVendorActionSucceeded = (state: VendorState) => state.actionSucceeded;
export const getVendorError = (state: VendorState) => state.error;
