export class BillOfMaterial {
    BillOfMaterialsId: number;
    ProductAssemblyId: number;
    ProductAssemblyName: string;
    ComponentId: number;
    ComponentName: string;
    HorizontalQuantity: number | null;
    HorizontalFormula: string;
    VerticalQuantity: number | null;
    VerticalFormula: string;
    UnitMeasureId: number;
    UnitMeasureName: string;
}
