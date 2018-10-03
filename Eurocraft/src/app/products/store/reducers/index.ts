import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from '../../../app.state';
import * as fromBillOfMaterial from './billofmaterial.reducer';
import * as fromProduct from './product.reducer';
import * as fromProductCategory from './productcategory.reducer';
import * as fromProductMaterial from './productmaterial.reducer';
import * as fromProductModel from './productmodel.reducer';
import * as fromProductSubcategory from './productsubcategory.reducer';
import * as fromProductType from './producttype.reducer';
import * as fromProductUse from './productuse.reducer';
import * as fromUnitMeasure from './unitmeasure.reducer';

export interface State extends fromRoot.State {
    productsState: ProductsState;
}

export interface ProductsState {
    billOfMaterialState: fromBillOfMaterial.BillOfMaterialState;
    productState: fromProduct.ProductState;
    productCategoryState: fromProductCategory.ProductCategoryState;
    productMaterialState: fromProductMaterial.ProductMaterialState;
    productModelState: fromProductModel.ProductModelState;
    productSubcategoryState: fromProductSubcategory.ProductSubcategoryState;
    productTypeState: fromProductType.ProductTypeState;
    productUseState: fromProductUse.ProductUseState;
    unitMeasureState: fromUnitMeasure.UnitMeasureState;
}

export const reducers: ActionReducerMap<ProductsState> = {
    billOfMaterialState: fromBillOfMaterial.reducer,
    productState: fromProduct.reducer,
    productCategoryState: fromProductCategory.reducer,
    productMaterialState: fromProductMaterial.reducer,
    productModelState: fromProductModel.reducer,
    productSubcategoryState: fromProductSubcategory.reducer,
    productTypeState: fromProductType.reducer,
    productUseState: fromProductUse.reducer,
    unitMeasureState: fromUnitMeasure.reducer
}

export const getProductsState = createFeatureSelector<ProductsState>('products');
