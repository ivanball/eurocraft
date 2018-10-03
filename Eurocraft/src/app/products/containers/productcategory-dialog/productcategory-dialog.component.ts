import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productCategoryActions from '../../store/actions/productcategory.actions';
import * as productMaterialActions from '../../store/actions/productmaterial.actions';
import * as productTypeActions from '../../store/actions/producttype.actions';
import * as productModelActions from '../../store/actions/productmodel.actions';
import * as productUseActions from '../../store/actions/productuse.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { ProductCategory } from '../../models/productcategory';
import { ProductMaterial } from '../../models/productmaterial';
import { ProductType } from '../../models/producttype';
import { ProductModel } from '../../models/productmodel';
import { ProductUse } from '../../models/productuse';

@Component({
  selector: 'app-productcategory-dialog',
  templateUrl: './productcategory-dialog.component.html',
  styleUrls: ['./productcategory-dialog.component.scss']
})
export class ProductCategoryDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'ProductCategory Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  productCategoryForm: FormGroup;

  productCategory: ProductCategory | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  productMaterials: ProductMaterial[];
  productTypes: ProductType[];
  productModels: ProductModel[];
  productUses: ProductUse[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      ProductCategoryName: {
        required: 'ProductCategory name is required.',
        minlength: 'ProductCategory name must be at least three characters.',
        maxlength: 'ProductCategory name cannot exceed 50 characters.'
      },
      ProductTypeId: {
        required: 'Product Type is required.',
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.store.dispatch(new productMaterialActions.LoadProductMaterialAll());
    this.store.pipe(
      select(selectors.getProductMaterialsAll),
      takeWhile(() => this.componentActive)
    ).subscribe((productMaterials: ProductMaterial[]) => {
      this.productMaterials = productMaterials;
    }
    );

    this.store.dispatch(new productTypeActions.LoadProductTypeAll());
    this.store.pipe(
      select(selectors.getProductTypesAll),
      takeWhile(() => this.componentActive)
    ).subscribe((productTypes: ProductType[]) => {
      this.productTypes = productTypes;
    }
    );

    this.store.dispatch(new productModelActions.LoadProductModelAll());
    this.store.pipe(
      select(selectors.getProductModelsAll),
      takeWhile(() => this.componentActive)
    ).subscribe((productModels: ProductModel[]) => {
      this.productModels = productModels;
    }
    );

    this.store.dispatch(new productUseActions.LoadProductUseAll());
    this.store.pipe(
      select(selectors.getProductUsesAll),
      takeWhile(() => this.componentActive)
    ).subscribe((productUses: ProductUse[]) => {
      this.productUses = productUses;
    }
    );

    this.productCategoryForm = this.fb.group({
      ProductCategoryName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      ProductTypeId: [null, [Validators.required]],
      ProductMaterialId: null,
      ProductModelId: null,
      ProductUseId: null
    });

    // Watch for changes to the currently selected productCategory
    this.store.pipe(
      select(selectors.getCurrentProductCategory),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProductCategory => this.displayProductCategory(currentProductCategory)
    );

    this.store.pipe(
      select(selectors.getProductCategoryActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.productCategory);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getProductCategoryError));

    // Watch for value changes
    this.productCategoryForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.productCategoryForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.productCategoryForm);
  }

  displayProductCategory(productCategory: ProductCategory | null): void {
    // Set the local productCategory property
    this.productCategory = productCategory;

    if (this.productCategory) {
      // Reset the form back to pristine
      this.productCategoryForm.reset();

      // Display the appropriate page title
      if (this.productCategory.ProductCategoryId === 0) {
        this.pageTitle = 'Add ProductCategory';
      } else {
        this.pageTitle = `Edit ProductCategory: ${this.productCategory.ProductCategoryName}`;
      }

      // Update the data on the form
      this.productCategoryForm.patchValue({
        ProductCategoryName: this.productCategory.ProductCategoryName,
        ProductMaterialId: this.productCategory.ProductMaterialId,
        ProductTypeId: this.productCategory.ProductTypeId,
        ProductModelId: this.productCategory.ProductModelId,
        ProductUseId: this.productCategory.ProductUseId
      });
    }
  }

  save(): void {
    if (this.productCategoryForm.valid) {
      //if (this.productCategoryForm.dirty) {
      // Copy over all of the original productCategory properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const productCategory = { ...this.productCategory, ...this.productCategoryForm.value };

      if (productCategory.ProductCategoryId === 0) {
        this.store.dispatch(new productCategoryActions.CreateProductCategory(productCategory));
      } else {
        this.store.dispatch(new productCategoryActions.UpdateProductCategory(productCategory));
      }

      //this.dialogRef.close(productCategory);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected productCategory
    // replacing any edits made
    //this.displayProductCategory(this.productCategory);
    this.store.dispatch(new productCategoryActions.ClearCurrentProductCategory());
    this.dialogRef.close(null);
  }

}
