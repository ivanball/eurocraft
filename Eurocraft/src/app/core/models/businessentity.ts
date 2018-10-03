import { BusinessEntityAddress } from "./businessentityaddress";
import { BusinessEntityContact } from "./businessentitycontact";
import { BusinessEntityEmail } from "./businessentityemail";
import { BusinessEntityPhone } from "./businessentityphone";

export class BusinessEntity {
    BusinessEntityId: number;
    Addresses: BusinessEntityAddress[];
    Contacts: BusinessEntityContact[];
    EmailAddresses: BusinessEntityEmail[];
    PhoneNumbers: BusinessEntityPhone[];
}
