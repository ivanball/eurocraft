import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as addressTypeActions from '../../store/actions/addresstype.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { AddressType } from '../../models/addresstype';

@Component({
  selector: 'app-addresstype-dialog',
  templateUrl: './addresstype-dialog.component.html',
  styleUrls: ['./addresstype-dialog.component.scss']
})
export class AddressTypeDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'AddressType Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  addressTypeForm: FormGroup;

  addressType: AddressType | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddressTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      AddressTypeName: {
        required: 'AddressType name is required.',
        minlength: 'AddressType name must be at least three characters.',
        maxlength: 'AddressType name cannot exceed 50 characters.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.addressTypeForm = this.fb.group({
      AddressTypeName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });

    // Watch for changes to the currently selected addressType
    this.store.pipe(
      select(selectors.getCurrentAddressType),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentAddressType => this.displayAddressType(currentAddressType)
    );

    this.store.pipe(
      select(selectors.getAddressTypeActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.addressType);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getAddressTypeError));

    // Watch for value changes
    this.addressTypeForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.addressTypeForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.addressTypeForm);
  }

  displayAddressType(addressType: AddressType | null): void {
    // Set the local addressType property
    this.addressType = addressType;

    if (this.addressType) {
      // Reset the form back to pristine
      this.addressTypeForm.reset();

      // Display the appropriate page title
      if (this.addressType.AddressTypeId === 0) {
        this.pageTitle = 'Add AddressType';
      } else {
        this.pageTitle = `Edit AddressType: ${this.addressType.AddressTypeName}`;
      }

      // Update the data on the form
      this.addressTypeForm.patchValue({
        AddressTypeName: this.addressType.AddressTypeName
      });
    }
  }

  save(): void {
    if (this.addressTypeForm.valid) {
      //if (this.addressTypeForm.dirty) {
      // Copy over all of the original addressType properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const addressType = { ...this.addressType, ...this.addressTypeForm.value };

      if (addressType.AddressTypeId === 0) {
        this.store.dispatch(new addressTypeActions.CreateAddressType(addressType));
      } else {
        this.store.dispatch(new addressTypeActions.UpdateAddressType(addressType));
      }

      //this.dialogRef.close(addressType);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected addressType
    // replacing any edits made
    //this.displayAddressType(this.addressType);
    this.store.dispatch(new addressTypeActions.ClearCurrentAddressType());
    this.dialogRef.close(null);
  }

}
