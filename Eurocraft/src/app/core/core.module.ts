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
import { CoreComponent } from './core.component';

// guards
import * as fromGuards from './guards';

// store
import { reducers, effects } from './store';

// services
import * as fromServices from './services';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  { path: '', component: CoreComponent, pathMatch: 'full' },
  { path: 'dealers', component: fromContainers.DealerListComponent },
  { path: 'vendors', component: fromContainers.VendorListComponent },
  { path: 'addresstypes', component: fromContainers.AddressTypeListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: 'countryregions', component: fromContainers.CountryRegionListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: 'dealertypes', component: fromContainers.DealerTypeListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: 'paymenttypes', component: fromContainers.PaymentTypeListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: 'phonenumbertypes', component: fromContainers.PhoneNumberTypeListComponent, canActivate: [fromGuards.AdminRouteGuard] },
  { path: 'stateprovinces', component: fromContainers.StateProvinceListComponent, canActivate: [fromGuards.AdminRouteGuard] },
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
    StoreModule.forFeature('core', reducers),
    EffectsModule.forFeature(effects),
  ],
  exports: [...fromContainers.containers], //, ...fromComponents.components],
  providers: [...fromServices.services, AuthService, ...fromGuards.guards],
  declarations: [CoreComponent, ...fromContainers.containers], //, ...fromComponents.components],
  entryComponents: [
    fromContainers.AddressTypeDialogComponent,
    fromContainers.CountryRegionDialogComponent,
    fromContainers.DealerDialogComponent,
    fromContainers.DealerTypeDialogComponent,
    fromContainers.PaymentTypeDialogComponent,
    fromContainers.PhoneNumberTypeDialogComponent,
    fromContainers.StateProvinceDialogComponent,
    fromContainers.VendorDialogComponent
  ]
})
export class CoreModule { }
