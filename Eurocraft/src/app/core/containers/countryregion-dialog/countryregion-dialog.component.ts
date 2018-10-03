import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as countryRegionActions from '../../store/actions/countryregion.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { CountryRegion } from '../../models/countryregion';

@Component({
  selector: 'app-countryregion-dialog',
  templateUrl: './countryregion-dialog.component.html',
  styleUrls: ['./countryregion-dialog.component.scss']
})
export class CountryRegionDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'CountryRegion Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  countryRegionForm: FormGroup;

  countryRegion: CountryRegion | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CountryRegionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      CountryRegionCode: {
        required: 'CountryRegion code is required.',
        maxlength: 'CountryRegion code cannot exceed 3 characters.'
      },
      CountryRegionName: {
        required: 'CountryRegion name is required.',
        minlength: 'CountryRegion name must be at least three characters.',
        maxlength: 'CountryRegion name cannot exceed 50 characters.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.countryRegionForm = this.fb.group({
      CountryRegionCode: ['', [Validators.required, Validators.maxLength(3)]],
      CountryRegionName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });

    // Watch for changes to the currently selected countryRegion
    this.store.pipe(
      select(selectors.getCurrentCountryRegion),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentCountryRegion => this.displayCountryRegion(currentCountryRegion)
    );

    this.store.pipe(
      select(selectors.getCountryRegionActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.countryRegion);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getCountryRegionError));

    // Watch for value changes
    this.countryRegionForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.countryRegionForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.countryRegionForm);
  }

  displayCountryRegion(countryRegion: CountryRegion | null): void {
    // Set the local countryRegion property
    this.countryRegion = countryRegion;

    if (this.countryRegion) {
      // Reset the form back to pristine
      this.countryRegionForm.reset();

      // Display the appropriate page title
      if (this.countryRegion.CountryRegionId === 0) {
        this.pageTitle = 'Add CountryRegion';
      } else {
        this.pageTitle = `Edit CountryRegion: ${this.countryRegion.CountryRegionName}`;
      }

      // Update the data on the form
      this.countryRegionForm.patchValue({
        CountryRegionCode: this.countryRegion.CountryRegionCode,
        CountryRegionName: this.countryRegion.CountryRegionName
      });
    }
  }

  save(): void {
    if (this.countryRegionForm.valid) {
      //if (this.countryRegionForm.dirty) {
      // Copy over all of the original countryRegion properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const countryRegion = { ...this.countryRegion, ...this.countryRegionForm.value };

      if (countryRegion.CountryRegionId === 0) {
        this.store.dispatch(new countryRegionActions.CreateCountryRegion(countryRegion));
      } else {
        this.store.dispatch(new countryRegionActions.UpdateCountryRegion(countryRegion));
      }

      //this.dialogRef.close(countryRegion);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected countryRegion
    // replacing any edits made
    //this.displayCountryRegion(this.countryRegion);
    this.store.dispatch(new countryRegionActions.ClearCurrentCountryRegion());
    this.dialogRef.close(null);
  }

}
