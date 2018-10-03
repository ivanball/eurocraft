import { PaymentType } from "../../models/paymenttype";
import { PaymentTypeActions, PaymentTypeActionTypes } from "../actions/paymenttype.actions";
import { DataSourceParameters } from "../../../shared/datasource.parameters";

export interface PaymentTypeState {
    loaded: boolean;
    loading: boolean;
    currentPaymentTypeId: number | null;
    paymentTypes: PaymentType[];
    paymentTypesAll: PaymentType[];
    paymentTypeCount: number;
    paymentTypeDataSourceParameters: DataSourceParameters;
    actionSucceeded: boolean;
    error: string;
}

const initialState: PaymentTypeState = {
    loaded: false,
    loading: false,
    currentPaymentTypeId: null,
    paymentTypes: [],
    paymentTypesAll: [],
    paymentTypeCount: 0,
    paymentTypeDataSourceParameters: new DataSourceParameters('', 'asc', 0, 5, []),
    actionSucceeded: false,
    error: ''
};

export function reducer(state = initialState, action: PaymentTypeActions): PaymentTypeState {

    switch (action.type) {
        case PaymentTypeActionTypes.SetCurrentPaymentType: {
            return {
                ...state,
                currentPaymentTypeId: action.payload.PaymentTypeId,
                error: ''
            };
        }
        case PaymentTypeActionTypes.ClearCurrentPaymentType: {
            return {
                ...state,
                currentPaymentTypeId: null,
                error: ''
            };
        }
        case PaymentTypeActionTypes.InitializeCurrentPaymentType: {
            return {
                ...state,
                currentPaymentTypeId: 0,
                error: ''
            };
        }
        case PaymentTypeActionTypes.SetPaymentTypeDataSourceParameters: {
            return {
                ...state,
                paymentTypeDataSourceParameters: action.payload
            };
        }
        case PaymentTypeActionTypes.LoadPaymentType: {
            return {
                ...state,
                loading: true,
                actionSucceeded: false,
                error: ''
            };
        }
        case PaymentTypeActionTypes.LoadPaymentTypeSuccess: {
            const paymentTypes = action.payload.value;
            return {
                ...state,
                loaded: true,
                loading: false,
                paymentTypes,
                paymentTypeCount: action.payload['@odata.count'],
                error: ''
            };
        }
        case PaymentTypeActionTypes.LoadPaymentTypeFail: {
            return {
                ...state,
                loaded: true,
                loading: false,
                paymentTypes: [],
                paymentTypeCount: 0,
                error: action.payload
            };
        }
        case PaymentTypeActionTypes.LoadPaymentTypeAll: {
            return {
                ...state,
            };
        }
        case PaymentTypeActionTypes.LoadPaymentTypeAllSuccess: {
            const paymentTypes = action.payload.value;
            return {
                ...state,
                paymentTypesAll: paymentTypes,
            };
        }
        case PaymentTypeActionTypes.LoadPaymentTypeAllFail: {
            return {
                ...state,
                paymentTypesAll: [],
            };
        }
        case PaymentTypeActionTypes.CreatePaymentTypeSuccess: {
            const paymentType = action.payload;
            return {
                ...state,
                paymentTypes: [...state.paymentTypes, paymentType],
                currentPaymentTypeId: paymentType.PaymentTypeId,
                actionSucceeded: true,
                error: ''
            };
        }
        case PaymentTypeActionTypes.CreatePaymentTypeFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case PaymentTypeActionTypes.UpdatePaymentTypeSuccess: {
            const paymentType = action.payload;
            const updatedPaymentTypes = state.paymentTypes.map(
                item => paymentType.PaymentTypeId === item.PaymentTypeId ? paymentType : item);

            return {
                ...state,
                paymentTypes: updatedPaymentTypes,
                currentPaymentTypeId: paymentType.PaymentTypeId,
                actionSucceeded: true,
                error: ''
            };
        }
        case PaymentTypeActionTypes.UpdatePaymentTypeFail: {
            return {
                ...state,
                actionSucceeded: false,
                error: action.payload
            };
        }
        case PaymentTypeActionTypes.DeletePaymentTypeSuccess: {
            return {
                ...state,
                paymentTypes: state.paymentTypes.filter(paymentType => paymentType.PaymentTypeId !== action.payload),
                currentPaymentTypeId: null,
                paymentTypeDataSourceParameters: new DataSourceParameters(
                    state.paymentTypeDataSourceParameters.sortColumn,
                    state.paymentTypeDataSourceParameters.sortDirection,
                    0,
                    state.paymentTypeDataSourceParameters.pageSize,
                    state.paymentTypeDataSourceParameters.filters),
                actionSucceeded: true,
                error: ''
            };
        }
        case PaymentTypeActionTypes.DeletePaymentTypeFail: {
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

export const getPaymentTypeLoaded = (state: PaymentTypeState) => state.loaded;
export const getPaymentTypeLoading = (state: PaymentTypeState) => state.loading;
export const getCurrentPaymentTypeId = (state: PaymentTypeState) => state.currentPaymentTypeId;
export const getPaymentTypes = (state: PaymentTypeState) => state.paymentTypes;
export const getPaymentTypesAll = (state: PaymentTypeState) => state.paymentTypesAll;
export const getPaymentTypeCount = (state: PaymentTypeState) => state.paymentTypeCount;
export const getPaymentTypeDataSourceParameters = (state: PaymentTypeState) => state.paymentTypeDataSourceParameters;
export const getPaymentTypeActionSucceeded = (state: PaymentTypeState) => state.actionSucceeded;
export const getPaymentTypeError = (state: PaymentTypeState) => state.error;
