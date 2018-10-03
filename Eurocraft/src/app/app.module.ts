import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// ngrx
import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// shared
import { environment } from '../environments/environment';
import { MaterialModule } from './shared/material.module';

// containers
import { AppComponent } from './containers/app/app.component';

// components
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

// store
import { reducers } from './app.state';

// not used in Production
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';

import { AuthService } from './core/services/auth.service';
import { AuthInterceptor } from './core/services/auth.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

export const metaReducers: MetaReducer<any>[] = !environment.production 
  ? [storeFreeze]
  : [];

export const routes: Routes = [
  { path: 'core', loadChildren: './core/core.module#CoreModule' },
  { path: 'orders', loadChildren: './orders/orders.module#OrdersModule' },
  { path: 'products', loadChildren: './products/products.module#ProductsModule' },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument({
      name: 'Eurocraft App Devtools',
      maxAge: 25,
      logOnly: environment.production
    }) : []
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    CurrencyPipe, AuthService
  ],
  declarations: [
    AppComponent,
    ToolbarComponent,
    SidenavComponent,
    UnauthorizedComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
