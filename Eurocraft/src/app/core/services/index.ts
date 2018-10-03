import { AddressTypeService } from './addresstype.service';
import { CountryRegionService } from './countryregion.service';
import { DealerService } from './dealer.service';
import { DealerTypeService } from './dealertype.service';
import { PaymentTypeService } from './paymenttype.service';
import { PhoneNumberTypeService } from './phonenumbertype.service';
import { StateProvinceService } from './stateprovince.service';
import { VendorService } from './vendor.service';

export const services: any[] = [
    AddressTypeService,
    CountryRegionService,
    DealerService,
    DealerTypeService,
    PaymentTypeService,
    PhoneNumberTypeService,
    StateProvinceService,
    VendorService
];

export * from './addresstype.service';
export * from './countryregion.service';
export * from './dealer.service';
export * from './dealertype.service';
export * from './paymenttype.service';
export * from './phonenumbertype.service';
export * from './stateprovince.service';
export * from './vendor.service';