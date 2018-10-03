import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as coreSelectors from '../../../core/store/selectors';
import * as salesOrderHeaderActions from '../../store/actions/salesorderheader.actions';
import * as dealerActions from '../../../core/store/actions/dealer.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { SalesOrderHeader } from '../../models/salesorderheader';
import { Dealer } from '../../../core/models/dealer';

@Component({
  selector: 'app-salesorder-dialog',
  templateUrl: './salesorder-dialog.component.html',
  styleUrls: ['./salesorder-dialog.component.scss']
})
export class SalesOrderDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'SalesOrder Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  salesOrderForm: FormGroup;

  salesOrder: SalesOrderHeader | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  dealers: Dealer[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SalesOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      SalesOrderNo: {
        required: 'SalesOrder No is required.'
      },
      DealerId: {
        required: 'Dealer is required.',
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.store.dispatch(new dealerActions.LoadDealerAll());
    this.store.pipe(
      select(coreSelectors.getDealersAll),
      takeWhile(() => this.componentActive)
    ).subscribe((dealers: Dealer[]) => {
      this.dealers = dealers;
    }
    );

    this.salesOrderForm = this.fb.group({
      SalesOrderNo: ['', [Validators.required]],
      DealerId: [null, [Validators.required]]
    });

    // Watch for changes to the currently selected salesOrder
    this.store.pipe(
      select(selectors.getCurrentSalesOrderHeader),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentSalesOrderHeader => this.displaySalesOrderHeader(currentSalesOrderHeader)
    );

    this.store.pipe(
      select(selectors.getSalesOrderHeaderActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.salesOrder);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getSalesOrderHeaderError));

    // Watch for value changes
    this.salesOrderForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.salesOrderForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.salesOrderForm);
  }

  displaySalesOrderHeader(salesOrder: SalesOrderHeader | null): void {
    // Set the local salesOrder property
    this.salesOrder = salesOrder;

    if (this.salesOrder) {
      // Reset the form back to pristine
      this.salesOrderForm.reset();

      // Display the appropriate page title
      if (this.salesOrder.SalesOrderId === 0) {
        this.pageTitle = 'Add SalesOrder';
      } else {
        this.pageTitle = `Edit SalesOrder: ${this.salesOrder.SalesOrderNo}`;
      }

      // Update the data on the form
      this.salesOrderForm.patchValue({
        SalesOrderNo: this.salesOrder.SalesOrderNo,
        DealerId: this.salesOrder.DealerId
      });
    }
  }

  save(): void {
    if (this.salesOrderForm.valid) {
      //if (this.salesOrderForm.dirty) {
      // Copy over all of the original salesOrder properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const salesOrder = { ...this.salesOrder, ...this.salesOrderForm.value };

      if (salesOrder.SalesOrderId === 0) {
        this.store.dispatch(new salesOrderHeaderActions.CreateSalesOrderHeader(salesOrder));
      } else {
        this.store.dispatch(new salesOrderHeaderActions.UpdateSalesOrderHeader(salesOrder));
      }

      //this.dialogRef.close(salesOrder);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected salesOrder
    // replacing any edits made
    //this.displaySalesOrderHeader(this.salesOrder);
    this.store.dispatch(new salesOrderHeaderActions.ClearCurrentSalesOrderHeader());
    this.dialogRef.close(null);
  }

}
