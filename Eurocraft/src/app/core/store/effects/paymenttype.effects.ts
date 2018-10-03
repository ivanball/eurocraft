import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as reducers from '../reducers';
import * as selectors from '../selectors';
import * as paymentTypeActions from '../actions/paymenttype.actions';
import { PaymentTypeService } from '../../services/paymenttype.service';
import { PaymentType } from '../../models/paymenttype';
import { DataSourceParameters } from '../../../shared/datasource.parameters';

@Injectable()
export class PaymentTypeEffects {

  constructor(
    private actions$: Actions,
    private paymentTypeService: PaymentTypeService,
    private store$: Store<reducers.State>) { }

  @Effect()
  loadPaymentTypes$: Observable<Action> = this.actions$.pipe(
    ofType(paymentTypeActions.PaymentTypeActionTypes.LoadPaymentType),
    withLatestFrom(this.store$.select(selectors.getPaymentTypeDataSourceParameters)),
    mergeMap(([action, paymentTypeDataSourceParameters]: [Action, DataSourceParameters]) =>
      this.paymentTypeService.getPaymentTypes2(paymentTypeDataSourceParameters).pipe(
        map(paymentTypes => (new paymentTypeActions.LoadPaymentTypeSuccess(paymentTypes))),
        catchError(err => of(new paymentTypeActions.LoadPaymentTypeFail(err)))
      )
    )
  );

  @Effect()
  loadPaymentTypesAll$: Observable<Action> = this.actions$.pipe(
    ofType(paymentTypeActions.PaymentTypeActionTypes.LoadPaymentTypeAll),
    mergeMap((action: Action) =>
      this.paymentTypeService.getPaymentTypes().pipe(
        map(paymentTypes => (new paymentTypeActions.LoadPaymentTypeAllSuccess(paymentTypes))),
        catchError(err => of(new paymentTypeActions.LoadPaymentTypeAllFail(err)))
      )
    )
  );

  @Effect()
  createPaymentType$: Observable<Action> = this.actions$.pipe(
    ofType(paymentTypeActions.PaymentTypeActionTypes.CreatePaymentType),
    map((action: paymentTypeActions.CreatePaymentType) => action.payload),
    mergeMap((paymentType: PaymentType) =>
      this.paymentTypeService.createPaymentType(paymentType).pipe(
        map(newPaymentType => (new paymentTypeActions.CreatePaymentTypeSuccess(newPaymentType))),
        catchError(err => of(new paymentTypeActions.CreatePaymentTypeFail(err)))
      )
    )
  );

  @Effect()
  updatePaymentType$: Observable<Action> = this.actions$.pipe(
    ofType(paymentTypeActions.PaymentTypeActionTypes.UpdatePaymentType),
    map((action: paymentTypeActions.UpdatePaymentType) => action.payload),
    mergeMap((paymentType: PaymentType) =>
      this.paymentTypeService.updatePaymentType(paymentType).pipe(
        map(updatedPaymentType => (new paymentTypeActions.UpdatePaymentTypeSuccess(updatedPaymentType))),
        catchError(err => of(new paymentTypeActions.UpdatePaymentTypeFail(err)))
      )
    )
  );

  @Effect()
  deletePaymentType$: Observable<Action> = this.actions$.pipe(
    ofType(paymentTypeActions.PaymentTypeActionTypes.DeletePaymentType),
    map((action: paymentTypeActions.DeletePaymentType) => action.payload),
    mergeMap((paymentTypeId: number) =>
      this.paymentTypeService.deletePaymentType(paymentTypeId).pipe(
        map(() => (new paymentTypeActions.DeletePaymentTypeSuccess(paymentTypeId))),
        catchError(err => of(new paymentTypeActions.DeletePaymentTypeFail(err)))
      )
    )
  );

  @Effect()
  handlePaymentTypeSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(
      paymentTypeActions.PaymentTypeActionTypes.SetPaymentTypeDataSourceParameters,
      paymentTypeActions.PaymentTypeActionTypes.CreatePaymentTypeSuccess,
      paymentTypeActions.PaymentTypeActionTypes.UpdatePaymentTypeSuccess,
      paymentTypeActions.PaymentTypeActionTypes.DeletePaymentTypeSuccess
    ),
    map(() => (new paymentTypeActions.LoadPaymentType())
    ));

}
