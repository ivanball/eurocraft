import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productModelActions from '../../store/actions/productmodel.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { ProductModel } from '../../models/productmodel';

@Component({
  selector: 'app-productmodel-dialog',
  templateUrl: './productmodel-dialog.component.html',
  styleUrls: ['./productmodel-dialog.component.scss']
})
export class ProductModelDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'ProductModel Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  productModelForm: FormGroup;

  productModel: ProductModel | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductModelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      ProductModelName: {
        required: 'ProductModel name is required.',
        minlength: 'ProductModel name must be at least three characters.',
        maxlength: 'ProductModel name cannot exceed 50 characters.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.productModelForm = this.fb.group({
      ProductModelName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });

    // Watch for changes to the currently selected productModel
    this.store.pipe(
      select(selectors.getCurrentProductModel),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProductModel => this.displayProductModel(currentProductModel)
    );

    this.store.pipe(
      select(selectors.getProductModelActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.productModel);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getProductModelError));

    // Watch for value changes
    this.productModelForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.productModelForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.productModelForm);
  }

  displayProductModel(productModel: ProductModel | null): void {
    // Set the local productModel property
    this.productModel = productModel;

    if (this.productModel) {
      // Reset the form back to pristine
      this.productModelForm.reset();

      // Display the appropriate page title
      if (this.productModel.ProductModelId === 0) {
        this.pageTitle = 'Add ProductModel';
      } else {
        this.pageTitle = `Edit ProductModel: ${this.productModel.ProductModelName}`;
      }

      // Update the data on the form
      this.productModelForm.patchValue({
        ProductModelName: this.productModel.ProductModelName
      });
    }
  }

  save(): void {
    if (this.productModelForm.valid) {
      //if (this.productModelForm.dirty) {
      // Copy over all of the original productModel properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const productModel = { ...this.productModel, ...this.productModelForm.value };

      if (productModel.ProductModelId === 0) {
        this.store.dispatch(new productModelActions.CreateProductModel(productModel));
      } else {
        this.store.dispatch(new productModelActions.UpdateProductModel(productModel));
      }

      //this.dialogRef.close(productModel);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected productModel
    // replacing any edits made
    //this.displayProductModel(this.productModel);
    this.store.dispatch(new productModelActions.ClearCurrentProductModel());
    this.dialogRef.close(null);
  }

}
