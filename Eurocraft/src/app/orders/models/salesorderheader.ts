export class SalesOrderHeader {
  SalesOrderId: number;
  RevisionNumber: number;
  SalesOrderNo: string;
  OrderDate: Date;
  DueDate: Date;
  ShipDate: Date | null;
  Status: number;
  DealerId: number;
  SalesPersonId: number | null;
  BillToAddressId: number | null;
  ShipToAddressId: number | null;
  ShipMethodId: number | null;
  SubTotal: number;
  TaxAmt: number;
  Freight: number;
  TotalDue: number;
  Comment: string;

  DealerName: string;
}
