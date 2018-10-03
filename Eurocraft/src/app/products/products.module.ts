import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ngrx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// shared
import { MaterialModule } from '../shared/material.module';

// containers
import * as fromContainers from './containers';
import { ProductsComponent } from './products.component';

// guards
import * as fromGuards from '../core/guards';

// store
import { reducers, effects } from './store';

// services
import * as fromServices from './services';
import { AuthService } from '../core/services/auth.service';

const routes: Routes = [
  { path: '', component: ProductsComponent, pathMatch: 'full' },
  { path: 'billofmaterials', component: fromContainers.BillOfMaterialListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: 'products', component: fromContainers.ProductListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: 'productcategories', component: fromContainers.ProductCategoryListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: 'productmaterials', component: fromContainers.ProductMaterialListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: 'productmodels', component: fromContainers.ProductModelListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: 'productsubcategories', component: fromContainers.ProductSubcategoryListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: 'producttypes', component: fromContainers.ProductTypeListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: 'productuses', component: fromContainers.ProductUseListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: 'unitmeasures', component: fromContainers.UnitMeasureListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('products', reducers),
    EffectsModule.forFeature(effects),
  ],
  exports: [...fromContainers.containers], //, ...fromComponents.components],
  providers: [...fromServices.services, AuthService, ...fromGuards.guards],
  declarations: [ProductsComponent, ...fromContainers.containers], //, ...fromComponents.components],
  entryComponents: [
    fromContainers.BillOfMaterialDialogComponent,
    fromContainers.ProductDialogComponent,
    fromContainers.ProductCategoryDialogComponent,
    fromContainers.ProductMaterialDialogComponent,
    fromContainers.ProductModelDialogComponent,
    fromContainers.ProductSubcategoryDialogComponent,
    fromContainers.ProductTypeDialogComponent,
    fromContainers.ProductUseDialogComponent,
    fromContainers.UnitMeasureDialogComponent
  ]
})
export class ProductsModule { }
