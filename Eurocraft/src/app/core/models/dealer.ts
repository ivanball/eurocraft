import { BusinessEntity } from "./businessentity";

export class Dealer {
  BusinessEntityId: number;
  ParentBusinessEntityId: number;
  DealerName: string;
  DealerTypeId: number;
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
