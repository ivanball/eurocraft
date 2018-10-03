import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productSubcategoryActions from '../../store/actions/productsubcategory.actions';
import * as productCategoryActions from '../../store/actions/productcategory.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { ProductSubcategory } from '../../models/productsubcategory';
import { ProductCategory } from '../../models/productcategory';

@Component({
  selector: 'app-productsubcategory-dialog',
  templateUrl: './productsubcategory-dialog.component.html',
  styleUrls: ['./productsubcategory-dialog.component.scss']
})
export class ProductSubcategoryDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'ProductSubcategory Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  productSubcategoryForm: FormGroup;

  productSubcategory: ProductSubcategory | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  productCategories: ProductCategory[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductSubcategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      ProductSubcategoryName: {
        required: 'ProductSubcategory name is required.',
        minlength: 'ProductSubcategory name must be at least three characters.',
        maxlength: 'ProductSubcategory name cannot exceed 50 characters.'
      },
      ProductCategoryId: {
        required: 'Product Category is required.',
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.store.dispatch(new productCategoryActions.LoadProductCategoryAll());
    this.store.pipe(
      select(selectors.getProductCategoriesAll),
      takeWhile(() => this.componentActive)
    ).subscribe((productCategories: ProductCategory[]) => {
      this.productCategories = productCategories;
    }
    );

    this.productSubcategoryForm = this.fb.group({
      ProductSubcategoryName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      ProductCategoryId: [null, [Validators.required]]
    });

    // Watch for changes to the currently selected productSubcategory
    this.store.pipe(
      select(selectors.getCurrentProductSubcategory),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProductSubcategory => this.displayProductSubcategory(currentProductSubcategory)
    );

    this.store.pipe(
      select(selectors.getProductSubcategoryActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.productSubcategory);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getProductSubcategoryError));

    // Watch for value changes
    this.productSubcategoryForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.productSubcategoryForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.productSubcategoryForm);
  }

  displayProductSubcategory(productSubcategory: ProductSubcategory | null): void {
    // Set the local productSubcategory property
    this.productSubcategory = productSubcategory;

    if (this.productSubcategory) {
      // Reset the form back to pristine
      this.productSubcategoryForm.reset();

      // Display the appropriate page title
      if (this.productSubcategory.ProductSubcategoryId === 0) {
        this.pageTitle = 'Add ProductSubcategory';
      } else {
        this.pageTitle = `Edit ProductSubcategory: ${this.productSubcategory.ProductSubcategoryName}`;
      }

      // Update the data on the form
      this.productSubcategoryForm.patchValue({
        ProductSubcategoryName: this.productSubcategory.ProductSubcategoryName,
        ProductCategoryId: this.productSubcategory.ProductCategoryId
      });
    }
  }

  save(): void {
    if (this.productSubcategoryForm.valid) {
      //if (this.productSubcategoryForm.dirty) {
      // Copy over all of the original productSubcategory properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const productSubcategory = { ...this.productSubcategory, ...this.productSubcategoryForm.value };

      if (productSubcategory.ProductSubcategoryId === 0) {
        this.store.dispatch(new productSubcategoryActions.CreateProductSubcategory(productSubcategory));
      } else {
        this.store.dispatch(new productSubcategoryActions.UpdateProductSubcategory(productSubcategory));
      }

      //this.dialogRef.close(productSubcategory);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected productSubcategory
    // replacing any edits made
    //this.displayProductSubcategory(this.productSubcategory);
    this.store.dispatch(new productSubcategoryActions.ClearCurrentProductSubcategory());
    this.dialogRef.close(null);
  }

}
