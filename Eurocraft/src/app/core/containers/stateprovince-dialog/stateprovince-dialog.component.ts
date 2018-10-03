import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as stateProvinceActions from '../../store/actions/stateprovince.actions';
import * as countryRegionActions from '../../store/actions/countryregion.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { StateProvince } from '../../models/stateprovince';
import { CountryRegion } from '../../models/countryregion';

@Component({
  selector: 'app-stateprovince-dialog',
  templateUrl: './stateprovince-dialog.component.html',
  styleUrls: ['./stateprovince-dialog.component.scss']
})
export class StateProvinceDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'StateProvince Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  stateProvinceForm: FormGroup;

  stateProvince: StateProvince | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  countryRegions: CountryRegion[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StateProvinceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      StateProvinceCode: {
        required: 'StateProvince code is required.',
        maxlength: 'StateProvince code cannot exceed 3 characters.'
      },
      StateProvinceName: {
        required: 'StateProvince name is required.',
        minlength: 'StateProvince name must be at least three characters.',
        maxlength: 'StateProvince name cannot exceed 50 characters.'
      },
      CountryRegionId: {
        required: 'Country is required.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.store.dispatch(new countryRegionActions.LoadCountryRegionAll());
    this.store.pipe(
      select(selectors.getCountryRegionsAll),
      takeWhile(() => this.componentActive)
    ).subscribe((countryRegions: CountryRegion[]) => {
      this.countryRegions = countryRegions;
    }
    );

    this.stateProvinceForm = this.fb.group({
      StateProvinceCode: ['', [Validators.required, Validators.maxLength(3)]],
      StateProvinceName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      CountryRegionId: [null, [Validators.required]]
    });

    // Watch for changes to the currently selected stateProvince
    this.store.pipe(
      select(selectors.getCurrentStateProvince),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentStateProvince => this.displayStateProvince(currentStateProvince)
    );

    this.store.pipe(
      select(selectors.getStateProvinceActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.stateProvince);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getStateProvinceError));

    // Watch for value changes
    this.stateProvinceForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.stateProvinceForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.stateProvinceForm);
  }

  displayStateProvince(stateProvince: StateProvince | null): void {
    // Set the local stateProvince property
    this.stateProvince = stateProvince;

    if (this.stateProvince) {
      // Reset the form back to pristine
      this.stateProvinceForm.reset();

      // Display the appropriate page title
      if (this.stateProvince.StateProvinceId === 0) {
        this.pageTitle = 'Add StateProvince';
      } else {
        this.pageTitle = `Edit StateProvince: ${this.stateProvince.StateProvinceName}`;
      }

      // Update the data on the form
      this.stateProvinceForm.patchValue({
        StateProvinceCode: this.stateProvince.StateProvinceCode,
        StateProvinceName: this.stateProvince.StateProvinceName,
        CountryRegionId: this.stateProvince.CountryRegionId
      });
    }
  }

  save(): void {
    if (this.stateProvinceForm.valid) {
      //if (this.stateProvinceForm.dirty) {
      // Copy over all of the original stateProvince properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const stateProvince = { ...this.stateProvince, ...this.stateProvinceForm.value };

      if (stateProvince.StateProvinceId === 0) {
        this.store.dispatch(new stateProvinceActions.CreateStateProvince(stateProvince));
      } else {
        this.store.dispatch(new stateProvinceActions.UpdateStateProvince(stateProvince));
      }

      //this.dialogRef.close(stateProvince);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected stateProvince
    // replacing any edits made
    //this.displayStateProvince(this.stateProvince);
    this.store.dispatch(new stateProvinceActions.ClearCurrentStateProvince());
    this.dialogRef.close(null);
  }

}
