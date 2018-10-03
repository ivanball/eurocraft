import { AddressType } from "../../models/addresstype";
import { AddressTypeActions, AddressTypeActionTypes } from "../actions/addresstype.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface AddressTypeState {
    loaded: boolean;
    loading: boolean;
    currentAddressTypeId: number | null;
    addressTypes: AddressType[];
    addressTypesAll: AddressType[];
    addressTypeCount: number;
    addressTypeDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: AddressTypeState = {
    loaded: false,
    loading: false,
    currentAddressTypeId: null,
    addressTypes: [],
    addressTypesAll: [],
    addressTypeCount: 0,
    addressTypeDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: AddressTypeActions): AddressTypeState {

    switch (action.type) {
        case AddressTypeActionTypes.SetCurrentAddressType: {
            return {
                ...state,
                currentAddressTypeId: action.payload.AddressTypeId,
                error: ''
            };
        }
        case AddressTypeActionTypes.ClearCurrentAddressType: {
            return {
                ...state,
                currentAddressTypeId: null,
                error: ''
            };
        }
        case AddressTypeActionTypes.InitializeCurrentAddressType: {
            return {
                ...state,
                currentAddressTypeId: 0,
                error: ''
            };
        }
        case AddressTypeActionTypes.SetAddressTypeDataSourceParameters: {
            return {
                ...state,
                addressTypeDataSourceParameters: action.payload
            };
        }
        case AddressTypeActionTypes.LoadAddressType: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case AddressTypeActionTypes.LoadAddressTypeSuccess: {
            const addressTypes = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                addressTypes,
                addressTypeCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case AddressTypeActionTypes.LoadAddressTypeFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                addressTypes: [],
                addressTypeCount: 0,
                error: action.payload
            };
        }
        case AddressTypeActionTypes.LoadAddressTypeAll: {
            return {
                ...state,
            };
        }
        case AddressTypeActionTypes.LoadAddressTypeAllSuccess: {
            const addressTypes = action.payload.value;
            return {
                ...state,
                addressTypesAll: addressTypes,
            };
        }
        case AddressTypeActionTypes.LoadAddressTypeAllFail: {
            return {
                ...state,
                addressTypesAll: [],
            };
        }
        case AddressTypeActionTypes.CreateAddressTypeSuccess: {
            const addressType = action.payload;
            return {
                ...state,
                addressTypes: [...state.addressTypes, addressType],
                currentAddressTypeId: addressType.AddressTypeId,
                actionSucceeded: true,
                error: ''
            };
        }
        case AddressTypeActionTypes.CreateAddressTypeFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case AddressTypeActionTypes.UpdateAddressTypeSuccess: {
            const addressType = action.payload;
            const updatedAddressTypes = state.addressTypes.map(
                item => addressType.AddressTypeId === item.AddressTypeId ? addressType : item);

            return {
                ...state,
                addressTypes: updatedAddressTypes,
                currentAddressTypeId: addressType.AddressTypeId,
                actionSucceeded: true,
                error: ''
            };
        }
        case AddressTypeActionTypes.UpdateAddressTypeFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case AddressTypeActionTypes.DeleteAddressTypeSuccess: {
            return {
                ...state,
                addressTypes: state.addressTypes.filter(addressType => addressType.AddressTypeId !== action.payload),
                currentAddressTypeId: null,
                addressTypeDataSourceParameters: new DataSourceParameters(
                    state.addressTypeDataSourceParameters.sortColumn,
                    state.addressTypeDataSourceParameters.sortDirection,
                    0,
                    state.addressTypeDataSourceParameters.pageSize,
                    state.addressTypeDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case AddressTypeActionTypes.DeleteAddressTypeFail: {
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

export const getAddressTypeLoaded = (state: AddressTypeState) => state.loaded;
export const getAddressTypeLoading = (state: AddressTypeState) => state.loading;
export const getCurrentAddressTypeId = (state: AddressTypeState) => state.currentAddressTypeId;
export const getAddressTypes = (state: AddressTypeState) => state.addressTypes;
export const getAddressTypesAll = (state: AddressTypeState) => state.addressTypesAll;
export const getAddressTypeCount = (state: AddressTypeState) => state.addressTypeCount;
export const getAddressTypeDataSourceParameters = (state: AddressTypeState) => state.addressTypeDataSourceParameters;
export const getAddressTypeActionSucceeded = (state: AddressTypeState) => state.actionSucceeded;
export const getAddressTypeError = (state: AddressTypeState) => state.error;
