import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productActions from '../../store/actions/product.actions';
import * as productCategoryActions from '../../store/actions/productcategory.actions';
import * as productSubcategoryActions from '../../store/actions/productsubcategory.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { ProductCategory } from '../../models/productcategory';
import { ProductSubcategory } from '../../models/productsubcategory';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Product Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  productForm: FormGroup;

  product: Product | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  productCategories: ProductCategory[];
  productSubcategories: ProductSubcategory[];
  filteredProductSubcategories: ProductSubcategory[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      ProductName: {
        required: 'Product name is required.',
        minlength: 'Product name must be at least three characters.',
        maxlength: 'Product name cannot exceed 50 characters.'
      },
      ProductNumber: {
        required: 'Product number is required.',
        maxlength: 'Product number cannot exceed 50 characters.'
      },
      ProductCategoryId: {
        required: 'Product Category is required.'
      },
      ProductSubcategoryId: {
        required: 'Product Subcategory is required.'
      },
      SEMFormula: {
        maxlength: 'SEM Formula cannot exceed 500 characters.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  onProductCategorySelect(productCategoryId: number) {
    if (productCategoryId == 0) {
      this.filteredProductSubcategories = this.productSubcategories
    } else {
      this.filteredProductSubcategories = this.productSubcategories
        .filter((item) => item.ProductCategoryId == productCategoryId);
    }
    this.productForm.patchValue({
      ProductSubcategoryId: null
    });
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

    this.store.dispatch(new productSubcategoryActions.LoadProductSubcategoryAll());
    this.store.pipe(
      select(selectors.getProductSubcategoriesAll),
      takeWhile(() => this.componentActive)
    ).subscribe((productSubcategories: ProductSubcategory[]) => {
      this.productSubcategories = productSubcategories;
      this.filteredProductSubcategories = productSubcategories;
    }
    );

    this.productForm = this.fb.group({
      ProductName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      ProductNumber: ['', [Validators.required, Validators.maxLength(50)]],
      ProductCategoryId: [null, [Validators.required]],
      ProductSubcategoryId: [null, [Validators.required]],
      SEMFormula: ['', [Validators.maxLength(500)]],
    });

    // Watch for changes to the currently selected product
    this.store.pipe(
      select(selectors.getCurrentProduct),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProduct => this.displayProduct(currentProduct)
    );

    this.store.pipe(
      select(selectors.getProductActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.product);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getProductError));

    // Watch for value changes
    this.productForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.productForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.productForm);
  }

  displayProduct(product: Product | null): void {
    // Set the local product property
    this.product = product;

    if (this.product) {
      // Reset the form back to pristine
      this.productForm.reset();

      // Display the appropriate page title
      if (this.product.ProductId === 0) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${this.product.ProductName}`;
      }

      // Update the data on the form
      this.productForm.patchValue({
        ProductName: this.product.ProductName,
        ProductNumber: this.product.ProductNumber,
        ProductCategoryId: this.product.ProductCategoryId,
        ProductSubcategoryId: this.product.ProductSubcategoryId,
        SEMFormula: this.product.SEMFormula
      });
    }
  }

  save(): void {
    if (this.productForm.valid) {
      //if (this.productForm.dirty) {
      // Copy over all of the original product properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const product = { ...this.product, ...this.productForm.value };

      if (product.ProductId === 0) {
        this.store.dispatch(new productActions.CreateProduct(product));
      } else {
        this.store.dispatch(new productActions.UpdateProduct(product));
      }

      //this.dialogRef.close(product);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected product
    // replacing any edits made
    //this.displayProduct(this.product);
    this.store.dispatch(new productActions.ClearCurrentProduct());
    this.dialogRef.close(null);
  }

}
