import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as unitMeasureActions from '../../store/actions/unitmeasure.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { UnitMeasure } from '../../models/unitmeasure';

@Component({
  selector: 'app-unitmeasure-dialog',
  templateUrl: './unitmeasure-dialog.component.html',
  styleUrls: ['./unitmeasure-dialog.component.scss']
})
export class UnitMeasureDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'UnitMeasure Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  unitMeasureForm: FormGroup;

  unitMeasure: UnitMeasure | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UnitMeasureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      UnitMeasureCode: {
        required: 'UnitMeasure code is required.'
      },
      UnitMeasureName: {
        required: 'UnitMeasure name is required.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.unitMeasureForm = this.fb.group({
      UnitMeasureCode: ['', [Validators.required]],
      UnitMeasureName: ['', [Validators.required]]
    });

    // Watch for changes to the currently selected unitMeasure
    this.store.pipe(
      select(selectors.getCurrentUnitMeasure),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentUnitMeasure => this.displayUnitMeasure(currentUnitMeasure)
    );

    this.store.pipe(
      select(selectors.getUnitMeasureActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.unitMeasure);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getUnitMeasureError));

    // Watch for value changes
    this.unitMeasureForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.unitMeasureForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.unitMeasureForm);
  }

  displayUnitMeasure(unitMeasure: UnitMeasure | null): void {
    // Set the local unitMeasure property
    this.unitMeasure = unitMeasure;

    if (this.unitMeasure) {
      // Reset the form back to pristine
      this.unitMeasureForm.reset();

      // Display the appropriate page title
      if (this.unitMeasure.UnitMeasureId === 0) {
        this.pageTitle = 'Add UnitMeasure';
      } else {
        this.pageTitle = `Edit UnitMeasure: ${this.unitMeasure.UnitMeasureName}`;
      }

      // Update the data on the form
      this.unitMeasureForm.patchValue({
        UnitMeasureCode: this.unitMeasure.UnitMeasureCode,
        UnitMeasureName: this.unitMeasure.UnitMeasureName
      });
    }
  }

  save(): void {
    if (this.unitMeasureForm.valid) {
      //if (this.unitMeasureForm.dirty) {
      // Copy over all of the original unitMeasure properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const unitMeasure = { ...this.unitMeasure, ...this.unitMeasureForm.value };

      if (unitMeasure.UnitMeasureId === 0) {
        this.store.dispatch(new unitMeasureActions.CreateUnitMeasure(unitMeasure));
      } else {
        this.store.dispatch(new unitMeasureActions.UpdateUnitMeasure(unitMeasure));
      }

      //this.dialogRef.close(unitMeasure);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected unitMeasure
    // replacing any edits made
    //this.displayUnitMeasure(this.unitMeasure);
    this.store.dispatch(new unitMeasureActions.ClearCurrentUnitMeasure());
    this.dialogRef.close(null);
  }

}
