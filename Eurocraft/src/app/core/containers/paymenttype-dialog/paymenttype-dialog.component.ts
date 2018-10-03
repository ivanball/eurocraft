import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as paymentTypeActions from '../../store/actions/paymenttype.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { PaymentType } from '../../models/paymenttype';

@Component({
  selector: 'app-paymenttype-dialog',
  templateUrl: './paymenttype-dialog.component.html',
  styleUrls: ['./paymenttype-dialog.component.scss']
})
export class PaymentTypeDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'PaymentType Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  paymentTypeForm: FormGroup;

  paymentType: PaymentType | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      PaymentTypeName: {
        required: 'PaymentType name is required.',
        minlength: 'PaymentType name must be at least three characters.',
        maxlength: 'PaymentType name cannot exceed 50 characters.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.paymentTypeForm = this.fb.group({
      PaymentTypeName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });

    // Watch for changes to the currently selected paymentType
    this.store.pipe(
      select(selectors.getCurrentPaymentType),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentPaymentType => this.displayPaymentType(currentPaymentType)
    );

    this.store.pipe(
      select(selectors.getPaymentTypeActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.paymentType);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getPaymentTypeError));

    // Watch for value changes
    this.paymentTypeForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.paymentTypeForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.paymentTypeForm);
  }

  displayPaymentType(paymentType: PaymentType | null): void {
    // Set the local paymentType property
    this.paymentType = paymentType;

    if (this.paymentType) {
      // Reset the form back to pristine
      this.paymentTypeForm.reset();

      // Display the appropriate page title
      if (this.paymentType.PaymentTypeId === 0) {
        this.pageTitle = 'Add PaymentType';
      } else {
        this.pageTitle = `Edit PaymentType: ${this.paymentType.PaymentTypeName}`;
      }

      // Update the data on the form
      this.paymentTypeForm.patchValue({
        PaymentTypeName: this.paymentType.PaymentTypeName
      });
    }
  }

  save(): void {
    if (this.paymentTypeForm.valid) {
      //if (this.paymentTypeForm.dirty) {
      // Copy over all of the original paymentType properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const paymentType = { ...this.paymentType, ...this.paymentTypeForm.value };

      if (paymentType.PaymentTypeId === 0) {
        this.store.dispatch(new paymentTypeActions.CreatePaymentType(paymentType));
      } else {
        this.store.dispatch(new paymentTypeActions.UpdatePaymentType(paymentType));
      }

      //this.dialogRef.close(paymentType);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected paymentType
    // replacing any edits made
    //this.displayPaymentType(this.paymentType);
    this.store.dispatch(new paymentTypeActions.ClearCurrentPaymentType());
    this.dialogRef.close(null);
  }

}
