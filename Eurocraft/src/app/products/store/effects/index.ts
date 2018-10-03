import { BillOfMaterialEffects } from './billofmaterial.effects';
import { ProductEffects } from './product.effects';
import { ProductCategoryEffects } from './productcategory.effects';
import { ProductMaterialEffects } from './productmaterial.effects';
import { ProductModelEffects } from './productmodel.effects';
import { ProductSubcategoryEffects } from './productsubcategory.effects';
import { ProductTypeEffects } from './producttype.effects';
import { ProductUseEffects } from './productuse.effects';
import { UnitMeasureEffects } from './unitmeasure.effects';

export const effects: any[] = [
    BillOfMaterialEffects,
    ProductEffects,
    ProductCategoryEffects,
    ProductMaterialEffects,
    ProductModelEffects,
    ProductSubcategoryEffects,
    ProductTypeEffects,
    ProductUseEffects,
    UnitMeasureEffects
];

export * from './billofmaterial.effects';
export * from './product.effects';
export * from './productcategory.effects';
export * from './productmaterial.effects';
export * from './productmodel.effects';
export * from './productsubcategory.effects';
export * from './producttype.effects';
export * from './productuse.effects';
export * from './unitmeasure.effects';
