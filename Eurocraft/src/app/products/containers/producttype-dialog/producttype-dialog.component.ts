import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productTypeActions from '../../store/actions/producttype.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { ProductType } from '../../models/producttype';

@Component({
  selector: 'app-producttype-dialog',
  templateUrl: './producttype-dialog.component.html',
  styleUrls: ['./producttype-dialog.component.scss']
})
export class ProductTypeDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'ProductType Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  productTypeForm: FormGroup;

  productType: ProductType | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      ProductTypeName: {
        required: 'ProductType name is required.',
        minlength: 'ProductType name must be at least three characters.',
        maxlength: 'ProductType name cannot exceed 50 characters.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.productTypeForm = this.fb.group({
      ProductTypeName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });

    // Watch for changes to the currently selected productType
    this.store.pipe(
      select(selectors.getCurrentProductType),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProductType => this.displayProductType(currentProductType)
    );

    this.store.pipe(
      select(selectors.getProductTypeActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.productType);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getProductTypeError));

    // Watch for value changes
    this.productTypeForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.productTypeForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.productTypeForm);
  }

  displayProductType(productType: ProductType | null): void {
    // Set the local productType property
    this.productType = productType;

    if (this.productType) {
      // Reset the form back to pristine
      this.productTypeForm.reset();

      // Display the appropriate page title
      if (this.productType.ProductTypeId === 0) {
        this.pageTitle = 'Add ProductType';
      } else {
        this.pageTitle = `Edit ProductType: ${this.productType.ProductTypeName}`;
      }

      // Update the data on the form
      this.productTypeForm.patchValue({
        ProductTypeName: this.productType.ProductTypeName
      });
    }
  }

  save(): void {
    if (this.productTypeForm.valid) {
      //if (this.productTypeForm.dirty) {
      // Copy over all of the original productType properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const productType = { ...this.productType, ...this.productTypeForm.value };

      if (productType.ProductTypeId === 0) {
        this.store.dispatch(new productTypeActions.CreateProductType(productType));
      } else {
        this.store.dispatch(new productTypeActions.UpdateProductType(productType));
      }

      //this.dialogRef.close(productType);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected productType
    // replacing any edits made
    //this.displayProductType(this.productType);
    this.store.dispatch(new productTypeActions.ClearCurrentProductType());
    this.dialogRef.close(null);
  }

}
