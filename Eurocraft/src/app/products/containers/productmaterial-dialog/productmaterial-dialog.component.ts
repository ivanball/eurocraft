import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productMaterialActions from '../../store/actions/productmaterial.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { ProductMaterial } from '../../models/productmaterial';

@Component({
  selector: 'app-productmaterial-dialog',
  templateUrl: './productmaterial-dialog.component.html',
  styleUrls: ['./productmaterial-dialog.component.scss']
})
export class ProductMaterialDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'ProductMaterial Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  productMaterialForm: FormGroup;

  productMaterial: ProductMaterial | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductMaterialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      ProductMaterialName: {
        required: 'ProductMaterial name is required.',
        minlength: 'ProductMaterial name must be at least three characters.',
        maxlength: 'ProductMaterial name cannot exceed 50 characters.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.productMaterialForm = this.fb.group({
      ProductMaterialName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });

    // Watch for changes to the currently selected productMaterial
    this.store.pipe(
      select(selectors.getCurrentProductMaterial),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProductMaterial => this.displayProductMaterial(currentProductMaterial)
    );

    this.store.pipe(
      select(selectors.getProductMaterialActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.productMaterial);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getProductMaterialError));

    // Watch for value changes
    this.productMaterialForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.productMaterialForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.productMaterialForm);
  }

  displayProductMaterial(productMaterial: ProductMaterial | null): void {
    // Set the local productMaterial property
    this.productMaterial = productMaterial;

    if (this.productMaterial) {
      // Reset the form back to pristine
      this.productMaterialForm.reset();

      // Display the appropriate page title
      if (this.productMaterial.ProductMaterialId === 0) {
        this.pageTitle = 'Add ProductMaterial';
      } else {
        this.pageTitle = `Edit ProductMaterial: ${this.productMaterial.ProductMaterialName}`;
      }

      // Update the data on the form
      this.productMaterialForm.patchValue({
        ProductMaterialName: this.productMaterial.ProductMaterialName
      });
    }
  }

  save(): void {
    if (this.productMaterialForm.valid) {
      //if (this.productMaterialForm.dirty) {
      // Copy over all of the original productMaterial properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const productMaterial = { ...this.productMaterial, ...this.productMaterialForm.value };

      if (productMaterial.ProductMaterialId === 0) {
        this.store.dispatch(new productMaterialActions.CreateProductMaterial(productMaterial));
      } else {
        this.store.dispatch(new productMaterialActions.UpdateProductMaterial(productMaterial));
      }

      //this.dialogRef.close(productMaterial);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected productMaterial
    // replacing any edits made
    //this.displayProductMaterial(this.productMaterial);
    this.store.dispatch(new productMaterialActions.ClearCurrentProductMaterial());
    this.dialogRef.close(null);
  }

}
