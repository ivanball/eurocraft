import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from '../../../app.state';
import * as fromAddressType from './addresstype.reducer';
import * as fromCountryRegion from './countryregion.reducer';
import * as fromDealer from './dealer.reducer';
import * as fromDealerType from './dealertype.reducer';
import * as fromPaymentType from './paymenttype.reducer';
import * as fromPhoneNumberType from './phonenumbertype.reducer';
import * as fromStateProvince from './stateprovince.reducer';
import * as fromVendor from './vendor.reducer';

export interface State extends fromRoot.State {
    coreState: CoreState;
}

export interface CoreState {
    addressTypeState: fromAddressType.AddressTypeState;
    countryRegionState: fromCountryRegion.CountryRegionState;
    dealerState: fromDealer.DealerState;
    dealerTypeState: fromDealerType.DealerTypeState;
    paymentTypeState: fromPaymentType.PaymentTypeState;
    phoneNumberTypeState: fromPhoneNumberType.PhoneNumberTypeState;
    stateProvinceState: fromStateProvince.StateProvinceState;
    vendorState: fromVendor.VendorState;
}

export const reducers: ActionReducerMap<CoreState> = {
    addressTypeState: fromAddressType.reducer,
    countryRegionState: fromCountryRegion.reducer,
    dealerState: fromDealer.reducer,
    dealerTypeState: fromDealerType.reducer,
    paymentTypeState: fromPaymentType.reducer,
    phoneNumberTypeState: fromPhoneNumberType.reducer,
    stateProvinceState: fromStateProvince.reducer,
    vendorState: fromVendor.reducer
}

export const getCoreState = createFeatureSelector<CoreState>('core');
