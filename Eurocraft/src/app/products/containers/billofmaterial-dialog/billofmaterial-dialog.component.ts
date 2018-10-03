import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as billOfMaterialActions from '../../store/actions/billofmaterial.actions';
import * as productActions from '../../store/actions/product.actions';
import * as unitMeasureActions from '../../store/actions/unitmeasure.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { BillOfMaterial } from '../../models/billofmaterial';
import { Product } from '../../models/product';
import { UnitMeasure } from '../../models/unitmeasure';

@Component({
  selector: 'app-billofmaterial-dialog',
  templateUrl: './billofmaterial-dialog.component.html',
  styleUrls: ['./billofmaterial-dialog.component.scss']
})
export class BillOfMaterialDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'BillOfMaterial Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  billOfMaterialForm: FormGroup;

  billOfMaterial: BillOfMaterial | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  productAssemblies: Product[];
  components: Product[];
  unitMeasures: UnitMeasure[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BillOfMaterialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      ProductAssemblyId: {
        required: 'Product Assembly is required.'
      },
      ComponentId: {
        required: 'Component is required.'
      },
      HorizontalQuantity: {
        required: 'Horizontal Quantity is required.'
      },
      HorizontalFormula: {
        required: 'Horizontal Formula is required.'
      },
      VerticalQuantity: {
        required: 'Vertical Quantity is required.'
      },
      VerticalFormula: {
        required: 'Vertical Formula is required.'
      },
      UnitMeasureId: {
        required: 'Unit Measure is required.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.store.dispatch(new productActions.LoadProductAll());
    this.store.pipe(
      select(selectors.getProductsAll),
      takeWhile(() => this.componentActive)
    ).subscribe((products: Product[]) => {
      this.productAssemblies = products;
      this.components = products;
    }
    );

    this.store.dispatch(new unitMeasureActions.LoadUnitMeasureAll());
    this.store.pipe(
      select(selectors.getUnitMeasuresAll),
      takeWhile(() => this.componentActive)
    ).subscribe((unitMeasures: UnitMeasure[]) => {
      this.unitMeasures = unitMeasures;
    }
    );

    this.billOfMaterialForm = this.fb.group({
      ProductAssemblyId: [null, [Validators.required]],
      ComponentId: [null, [Validators.required]],
      HorizontalQuantity: ['', [Validators.required]],
      HorizontalFormula: ['', [Validators.required]],
      VerticalQuantity: ['', [Validators.required]],
      VerticalFormula: ['', [Validators.required]],
      UnitMeasureId: [null, [Validators.required]]
    });

    // Watch for changes to the currently selected billOfMaterial
    this.store.pipe(
      select(selectors.getCurrentBillOfMaterial),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentBillOfMaterial => this.displayBillOfMaterial(currentBillOfMaterial)
    );

    this.store.pipe(
      select(selectors.getBillOfMaterialActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.billOfMaterial);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getBillOfMaterialError));

    // Watch for value changes
    this.billOfMaterialForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.billOfMaterialForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.billOfMaterialForm);
  }

  displayBillOfMaterial(billOfMaterial: BillOfMaterial | null): void {
    // Set the local billOfMaterial property
    this.billOfMaterial = billOfMaterial;

    if (this.billOfMaterial) {
      // Reset the form back to pristine
      this.billOfMaterialForm.reset();

      // Display the appropriate page title
      if (this.billOfMaterial.BillOfMaterialsId === 0) {
        this.pageTitle = 'Add BillOfMaterial';
      } else {
        this.pageTitle = `Edit BillOfMaterial: ${this.billOfMaterial.ProductAssemblyName} - ${this.billOfMaterial.ComponentName}`;
      }

      // Update the data on the form
      this.billOfMaterialForm.patchValue({
        ProductAssemblyId: this.billOfMaterial.ProductAssemblyId,
        ComponentId: this.billOfMaterial.ComponentId,
        HorizontalQuantity: this.billOfMaterial.HorizontalQuantity,
        HorizontalFormula: this.billOfMaterial.HorizontalFormula,
        VerticalQuantity: this.billOfMaterial.VerticalQuantity,
        VerticalFormula: this.billOfMaterial.VerticalFormula,
        UnitMeasureId: this.billOfMaterial.UnitMeasureId
      });
    }
  }

  save(): void {
    if (this.billOfMaterialForm.valid) {
      //if (this.billOfMaterialForm.dirty) {
      // Copy over all of the original billOfMaterial properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const billOfMaterial = { ...this.billOfMaterial, ...this.billOfMaterialForm.value };

      if (billOfMaterial.BillOfMaterialsId === 0) {
        this.store.dispatch(new billOfMaterialActions.CreateBillOfMaterial(billOfMaterial));
      } else {
        this.store.dispatch(new billOfMaterialActions.UpdateBillOfMaterial(billOfMaterial));
      }

      //this.dialogRef.close(billOfMaterial);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected billOfMaterial
    // replacing any edits made
    //this.displayBillOfMaterial(this.billOfMaterial);
    this.store.dispatch(new billOfMaterialActions.ClearCurrentBillOfMaterial());
    this.dialogRef.close(null);
  }

}
