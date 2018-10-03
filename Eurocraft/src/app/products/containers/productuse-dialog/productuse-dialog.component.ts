import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productUseActions from '../../store/actions/productuse.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { ProductUse } from '../../models/productuse';

@Component({
  selector: 'app-productuse-dialog',
  templateUrl: './productuse-dialog.component.html',
  styleUrls: ['./productuse-dialog.component.scss']
})
export class ProductUseDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'ProductUse Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  productUseForm: FormGroup;

  productUse: ProductUse | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductUseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      ProductUseName: {
        required: 'ProductUse name is required.',
        minlength: 'ProductUse name must be at least three characters.',
        maxlength: 'ProductUse name cannot exceed 50 characters.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.productUseForm = this.fb.group({
      ProductUseName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });

    // Watch for changes to the currently selected productUse
    this.store.pipe(
      select(selectors.getCurrentProductUse),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProductUse => this.displayProductUse(currentProductUse)
    );

    this.store.pipe(
      select(selectors.getProductUseActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.productUse);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getProductUseError));

    // Watch for value changes
    this.productUseForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.productUseForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.productUseForm);
  }

  displayProductUse(productUse: ProductUse | null): void {
    // Set the local productUse property
    this.productUse = productUse;

    if (this.productUse) {
      // Reset the form back to pristine
      this.productUseForm.reset();

      // Display the appropriate page title
      if (this.productUse.ProductUseId === 0) {
        this.pageTitle = 'Add ProductUse';
      } else {
        this.pageTitle = `Edit ProductUse: ${this.productUse.ProductUseName}`;
      }

      // Update the data on the form
      this.productUseForm.patchValue({
        ProductUseName: this.productUse.ProductUseName
      });
    }
  }

  save(): void {
    if (this.productUseForm.valid) {
      //if (this.productUseForm.dirty) {
      // Copy over all of the original productUse properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const productUse = { ...this.productUse, ...this.productUseForm.value };

      if (productUse.ProductUseId === 0) {
        this.store.dispatch(new productUseActions.CreateProductUse(productUse));
      } else {
        this.store.dispatch(new productUseActions.UpdateProductUse(productUse));
      }

      //this.dialogRef.close(productUse);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected productUse
    // replacing any edits made
    //this.displayProductUse(this.productUse);
    this.store.dispatch(new productUseActions.ClearCurrentProductUse());
    this.dialogRef.close(null);
  }

}
