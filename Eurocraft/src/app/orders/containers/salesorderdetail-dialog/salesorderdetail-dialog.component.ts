import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productsSelectors from '../../../products/store/selectors';
import * as salesOrderDetailActions from '../../store/actions/salesorderdetail.actions';
import * as productActions from '../../../products/store/actions/product.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { SalesOrderDetail } from '../../models/salesorderdetail';
import { Product } from '../../../products/models/product';

@Component({
  selector: 'app-salesorderdetail-dialog',
  templateUrl: './salesorderdetail-dialog.component.html',
  styleUrls: ['./salesorderdetail-dialog.component.scss']
})
export class SalesOrderDetailDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'SalesOrderDetail Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  salesOrderDetailForm: FormGroup;

  salesOrderDetail: SalesOrderDetail | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  products: Product[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SalesOrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      OrderQty: {
        required: 'Quantity is required.'
      },
      ProductId: {
        required: 'Product is required.',
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.store.dispatch(new productActions.LoadProductAll());
    this.store.pipe(
      select(productsSelectors.getProductsAll),
      takeWhile(() => this.componentActive)
    ).subscribe((products: Product[]) => {
      this.products = products;
    }
    );

    this.salesOrderDetailForm = this.fb.group({
      OrderQty: ['', [Validators.required]],
      ProductId: [null, [Validators.required]]
    });

    // Watch for changes to the currently selected salesOrderDetail
    this.store.pipe(
      select(selectors.getCurrentSalesOrderDetail),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentSalesOrderDetail => this.displaySalesOrderDetail(currentSalesOrderDetail)
    );

    this.store.pipe(
      select(selectors.getSalesOrderDetailActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.salesOrderDetail);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getSalesOrderDetailError));

    // Watch for value changes
    this.salesOrderDetailForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.salesOrderDetailForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.salesOrderDetailForm);
  }

  displaySalesOrderDetail(salesOrderDetail: SalesOrderDetail | null): void {
    // Set the local salesOrderDetail property
    this.salesOrderDetail = salesOrderDetail;

    if (this.salesOrderDetail) {
      // Reset the form back to pristine
      this.salesOrderDetailForm.reset();

      // Display the appropriate page title
      if (this.salesOrderDetail.SalesOrderDetailId === 0) {
        this.pageTitle = 'Add SalesOrderDetail';
      } else {
        this.pageTitle = `Edit SalesOrderDetail: ${this.salesOrderDetail.SalesOrderDetailId}`;
      }

      // Update the data on the form
      this.salesOrderDetailForm.patchValue({
        OrderQty: this.salesOrderDetail.OrderQty,
        ProductId: this.salesOrderDetail.ProductId
      });
    }
  }

  save(): void {
    if (this.salesOrderDetailForm.valid) {
      //if (this.salesOrderDetailForm.dirty) {
      // Copy over all of the original salesOrderDetail properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const salesOrderDetail = { ...this.salesOrderDetail, ...this.salesOrderDetailForm.value };

      if (salesOrderDetail.SalesOrderDetailId === 0) {
        this.store.dispatch(new salesOrderDetailActions.CreateSalesOrderDetail(salesOrderDetail));
      } else {
        this.store.dispatch(new salesOrderDetailActions.UpdateSalesOrderDetail(salesOrderDetail));
      }

      //this.dialogRef.close(salesOrderDetail);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected salesOrderDetail
    // replacing any edits made
    //this.displaySalesOrderDetail(this.salesOrderDetail);
    this.store.dispatch(new salesOrderDetailActions.ClearCurrentSalesOrderDetail());
    this.dialogRef.close(null);
  }

}
