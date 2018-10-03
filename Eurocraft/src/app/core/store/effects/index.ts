import { AddressTypeEffects } from './addresstype.effects';
import { CountryRegionEffects } from './countryregion.effects';
import { DealerEffects } from './dealer.effects';
import { DealerTypeEffects } from './dealertype.effects';
import { PaymentTypeEffects } from './paymenttype.effects';
import { PhoneNumberTypeEffects } from './phonenumbertype.effects';
import { StateProvinceEffects } from './stateprovince.effects';
import { VendorEffects } from './vendor.effects';

export const effects: any[] = [
    AddressTypeEffects,
    CountryRegionEffects,
    DealerEffects, 
    DealerTypeEffects, 
    PaymentTypeEffects, 
    PhoneNumberTypeEffects, 
    StateProvinceEffects, 
    VendorEffects
];

export * from './addresstype.effects';
export * from './countryregion.effects';
export * from './dealer.effects';
export * from './dealertype.effects';
export * from './paymenttype.effects';
export * from './phonenumbertype.effects';
export * from './stateprovince.effects';
export * from './vendor.effects';