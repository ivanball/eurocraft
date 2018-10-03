import { PhoneNumberType } from "../../models/phonenumbertype";
import { PhoneNumberTypeActions, PhoneNumberTypeActionTypes } from "../actions/phonenumbertype.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface PhoneNumberTypeState {
    loaded: boolean;
    loading: boolean;
    currentPhoneNumberTypeId: number | null;
    phoneNumberTypes: PhoneNumberType[];
    phoneNumberTypesAll: PhoneNumberType[];
    phoneNumberTypeCount: number;
    phoneNumberTypeDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: PhoneNumberTypeState = {
    loaded: false,
    loading: false,
    currentPhoneNumberTypeId: null,
    phoneNumberTypes: [],
    phoneNumberTypesAll: [],
    phoneNumberTypeCount: 0,
    phoneNumberTypeDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: PhoneNumberTypeActions): PhoneNumberTypeState {

    switch (action.type) {
        case PhoneNumberTypeActionTypes.SetCurrentPhoneNumberType: {
            return {
                ...state,
                currentPhoneNumberTypeId: action.payload.PhoneNumberTypeId,
                error: ''
            };
        }
        case PhoneNumberTypeActionTypes.ClearCurrentPhoneNumberType: {
            return {
                ...state,
                currentPhoneNumberTypeId: null,
                error: ''
            };
        }
        case PhoneNumberTypeActionTypes.InitializeCurrentPhoneNumberType: {
            return {
                ...state,
                currentPhoneNumberTypeId: 0,
                error: ''
            };
        }
        case PhoneNumberTypeActionTypes.SetPhoneNumberTypeDataSourceParameters: {
            return {
                ...state,
                phoneNumberTypeDataSourceParameters: action.payload
            };
        }
        case PhoneNumberTypeActionTypes.LoadPhoneNumberType: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case PhoneNumberTypeActionTypes.LoadPhoneNumberTypeSuccess: {
            const phoneNumberTypes = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                phoneNumberTypes,
                phoneNumberTypeCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case PhoneNumberTypeActionTypes.LoadPhoneNumberTypeFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                phoneNumberTypes: [],
                phoneNumberTypeCount: 0,
                error: action.payload
            };
        }
        case PhoneNumberTypeActionTypes.LoadPhoneNumberTypeAll: {
            return {
                ...state,
            };
        }
        case PhoneNumberTypeActionTypes.LoadPhoneNumberTypeAllSuccess: {
            const phoneNumberTypes = action.payload.value;
            return {
                ...state,
                phoneNumberTypesAll: phoneNumberTypes,
            };
        }
        case PhoneNumberTypeActionTypes.LoadPhoneNumberTypeAllFail: {
            return {
                ...state,
                phoneNumberTypesAll: [],
            };
        }
        case PhoneNumberTypeActionTypes.CreatePhoneNumberTypeSuccess: {
            const phoneNumberType = action.payload;
            return {
                ...state,
                phoneNumberTypes: [...state.phoneNumberTypes, phoneNumberType],
                currentPhoneNumberTypeId: phoneNumberType.PhoneNumberTypeId,
                actionSucceeded: true,
                error: ''
            };
        }
        case PhoneNumberTypeActionTypes.CreatePhoneNumberTypeFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case PhoneNumberTypeActionTypes.UpdatePhoneNumberTypeSuccess: {
            const phoneNumberType = action.payload;
            const updatedPhoneNumberTypes = state.phoneNumberTypes.map(
                item => phoneNumberType.PhoneNumberTypeId === item.PhoneNumberTypeId ? phoneNumberType : item);

            return {
                ...state,
                phoneNumberTypes: updatedPhoneNumberTypes,
                currentPhoneNumberTypeId: phoneNumberType.PhoneNumberTypeId,
                actionSucceeded: true,
                error: ''
            };
        }
        case PhoneNumberTypeActionTypes.UpdatePhoneNumberTypeFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case PhoneNumberTypeActionTypes.DeletePhoneNumberTypeSuccess: {
            return {
                ...state,
                phoneNumberTypes: state.phoneNumberTypes.filter(phoneNumberType => phoneNumberType.PhoneNumberTypeId !== action.payload),
                currentPhoneNumberTypeId: null,
                phoneNumberTypeDataSourceParameters: new DataSourceParameters(
                    state.phoneNumberTypeDataSourceParameters.sortColumn,
                    state.phoneNumberTypeDataSourceParameters.sortDirection,
                    0,
                    state.phoneNumberTypeDataSourceParameters.pageSize,
                    state.phoneNumberTypeDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case PhoneNumberTypeActionTypes.DeletePhoneNumberTypeFail: {
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

export const getPhoneNumberTypeLoaded = (state: PhoneNumberTypeState) => state.loaded;
export const getPhoneNumberTypeLoading = (state: PhoneNumberTypeState) => state.loading;
export const getCurrentPhoneNumberTypeId = (state: PhoneNumberTypeState) => state.currentPhoneNumberTypeId;
export const getPhoneNumberTypes = (state: PhoneNumberTypeState) => state.phoneNumberTypes;
export const getPhoneNumberTypesAll = (state: PhoneNumberTypeState) => state.phoneNumberTypesAll;
export const getPhoneNumberTypeCount = (state: PhoneNumberTypeState) => state.phoneNumberTypeCount;
export const getPhoneNumberTypeDataSourceParameters = (state: PhoneNumberTypeState) => state.phoneNumberTypeDataSourceParameters;
export const getPhoneNumberTypeActionSucceeded = (state: PhoneNumberTypeState) => state.actionSucceeded;
export const getPhoneNumberTypeError = (state: PhoneNumberTypeState) => state.error;
