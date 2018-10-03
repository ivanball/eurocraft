import { BillOfMaterialService } from './billofmaterial.service';
import { ProductService } from './product.service';
import { ProductCategoryService } from './productcategory.service';
import { ProductMaterialService } from './productmaterial.service';
import { ProductModelService } from './productmodel.service';
import { ProductSubcategoryService } from './productsubcategory.service';
import { ProductTypeService } from './producttype.service';
import { ProductUseService } from './productuse.service';

export const services: any[] = [
    BillOfMaterialService,
    ProductService,
    ProductCategoryService,
    ProductMaterialService,
    ProductModelService,
    ProductSubcategoryService,
    ProductTypeService,
    ProductUseService
];

export * from './billofmaterial.service';
export * from './product.service';
export * from './productcategory.service';
export * from './productmaterial.service';
export * from './productmodel.service';
export * from './productsubcategory.service';
export * from './producttype.service';
export * from './productuse.service';
