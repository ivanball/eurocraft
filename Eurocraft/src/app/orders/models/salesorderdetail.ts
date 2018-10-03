export class SalesOrderDetail {
    SalesOrderDetailId: number;
    SalesOrderId: number;
    OrderQty: number;
    ProductId: number;
    HorizontalSize: number | null;
    VerticalSize: number | null;
    UnitMeasureId: number | null;
    UnitPrice: number;
    UnitPriceDiscount: number;
    LineTotal: number;
    Glazing: string;
    HandleColor: string;
    Color: string;
    CarrierTrackingNumber: string;

    ProductName: string;
}
  