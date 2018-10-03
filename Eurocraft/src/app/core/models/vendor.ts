import { BusinessEntity } from "./businessentity";

export class Vendor {
  BusinessEntityId: number;
  VendorName: string;
  AccountNumber: string;
  Website: string;
  IsTaxExempt: string;
  PaymentTerms: string;
  PricingLevel: number | null;
  CreditAmount: number | null;
  BusinessEntity: BusinessEntity;
  PhoneNumber: string;
  AddressCity: string;
}
