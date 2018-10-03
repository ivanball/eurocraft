import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as phoneNumberTypeActions from '../../store/actions/phonenumbertype.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { PhoneNumberType } from '../../models/phonenumbertype';

@Component({
  selector: 'app-phonenumbertype-dialog',
  templateUrl: './phonenumbertype-dialog.component.html',
  styleUrls: ['./phonenumbertype-dialog.component.scss']
})
export class PhoneNumberTypeDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'PhoneNumberType Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  phoneNumberTypeForm: FormGroup;

  phoneNumberType: PhoneNumberType | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PhoneNumberTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      PhoneNumberTypeName: {
        required: 'PhoneNumberType name is required.',
        minlength: 'PhoneNumberType name must be at least three characters.',
        maxlength: 'PhoneNumberType name cannot exceed 50 characters.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.phoneNumberTypeForm = this.fb.group({
      PhoneNumberTypeName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });

    // Watch for changes to the currently selected phoneNumberType
    this.store.pipe(
      select(selectors.getCurrentPhoneNumberType),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentPhoneNumberType => this.displayPhoneNumberType(currentPhoneNumberType)
    );

    this.store.pipe(
      select(selectors.getPhoneNumberTypeActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.phoneNumberType);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getPhoneNumberTypeError));

    // Watch for value changes
    this.phoneNumberTypeForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.phoneNumberTypeForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.phoneNumberTypeForm);
  }

  displayPhoneNumberType(phoneNumberType: PhoneNumberType | null): void {
    // Set the local phoneNumberType property
    this.phoneNumberType = phoneNumberType;

    if (this.phoneNumberType) {
      // Reset the form back to pristine
      this.phoneNumberTypeForm.reset();

      // Display the appropriate page title
      if (this.phoneNumberType.PhoneNumberTypeId === 0) {
        this.pageTitle = 'Add PhoneNumberType';
      } else {
        this.pageTitle = `Edit PhoneNumberType: ${this.phoneNumberType.PhoneNumberTypeName}`;
      }

      // Update the data on the form
      this.phoneNumberTypeForm.patchValue({
        PhoneNumberTypeName: this.phoneNumberType.PhoneNumberTypeName
      });
    }
  }

  save(): void {
    if (this.phoneNumberTypeForm.valid) {
      //if (this.phoneNumberTypeForm.dirty) {
      // Copy over all of the original phoneNumberType properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const phoneNumberType = { ...this.phoneNumberType, ...this.phoneNumberTypeForm.value };

      if (phoneNumberType.PhoneNumberTypeId === 0) {
        this.store.dispatch(new phoneNumberTypeActions.CreatePhoneNumberType(phoneNumberType));
      } else {
        this.store.dispatch(new phoneNumberTypeActions.UpdatePhoneNumberType(phoneNumberType));
      }

      //this.dialogRef.close(phoneNumberType);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected phoneNumberType
    // replacing any edits made
    //this.displayPhoneNumberType(this.phoneNumberType);
    this.store.dispatch(new phoneNumberTypeActions.ClearCurrentPhoneNumberType());
    this.dialogRef.close(null);
  }

}
