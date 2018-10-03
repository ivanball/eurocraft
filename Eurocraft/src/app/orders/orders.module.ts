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
import { OrdersComponent } from './orders.component';

// guards
import * as fromGuards from '../core/guards';

// store
import { reducers, effects } from './store';

// services
import * as fromServices from './services';
import { AuthService } from '../core/services/auth.service';

const routes: Routes = [
  { path: '', component: OrdersComponent, pathMatch: 'full' },
  { path: 'salesorders', component: fromContainers.SalesOrderListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: 'salesorderdetails', component: fromContainers.SalesOrderDetailListComponent, canActivate: [fromGuards.AdminRouteGuard] },
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
    StoreModule.forFeature('orders', reducers),
    EffectsModule.forFeature(effects),
  ],
  exports: [...fromContainers.containers], //, ...fromComponents.components],
  providers: [...fromServices.services, AuthService, ...fromGuards.guards],
  declarations: [OrdersComponent, ...fromContainers.containers], //, ...fromComponents.components],
  entryComponents: [
    fromContainers.SalesOrderDialogComponent,
    fromContainers.SalesOrderDetailDialogComponent
  ]
})
export class OrdersModule { }
