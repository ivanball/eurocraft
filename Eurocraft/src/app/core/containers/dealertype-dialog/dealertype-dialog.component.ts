import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as dealerTypeActions from '../../store/actions/dealertype.actions';

import { GenericValidator } from '../../../shared/generic-validator';
import { DealerType } from '../../models/dealertype';

@Component({
  selector: 'app-dealertype-dialog',
  templateUrl: './dealertype-dialog.component.html',
  styleUrls: ['./dealertype-dialog.component.scss']
})
export class DealerTypeDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = 'DealerType Edit';
  errorMessage$: Observable<string>;
  componentActive = true;
  dealerTypeForm: FormGroup;

  dealerType: DealerType | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DealerTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      DealerTypeName: {
        required: 'DealerType name is required.',
        minlength: 'DealerType name must be at least three characters.',
        maxlength: 'DealerType name cannot exceed 50 characters.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.dealerTypeForm = this.fb.group({
      DealerTypeName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });

    // Watch for changes to the currently selected dealerType
    this.store.pipe(
      select(selectors.getCurrentDealerType),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentDealerType => this.displayDealerType(currentDealerType)
    );

    this.store.pipe(
      select(selectors.getDealerTypeActionSucceeded),
      takeWhile(() => this.componentActive)
    ).subscribe(
      actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.dealerType);
        }
      }
    );

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getDealerTypeError));

    // Watch for value changes
    this.dealerTypeForm.valueChanges.subscribe(
      //value => console.log(value)
      value => this.displayMessage = this.genericValidator.processMessages(this.dealerTypeForm)
    );

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.dealerTypeForm);
  }

  displayDealerType(dealerType: DealerType | null): void {
    // Set the local dealerType property
    this.dealerType = dealerType;

    if (this.dealerType) {
      // Reset the form back to pristine
      this.dealerTypeForm.reset();

      // Display the appropriate page title
      if (this.dealerType.DealerTypeId === 0) {
        this.pageTitle = 'Add DealerType';
      } else {
        this.pageTitle = `Edit DealerType: ${this.dealerType.DealerTypeName}`;
      }

      // Update the data on the form
      this.dealerTypeForm.patchValue({
        DealerTypeName: this.dealerType.DealerTypeName
      });
    }
  }

  save(): void {
    if (this.dealerTypeForm.valid) {
      //if (this.dealerTypeForm.dirty) {
      // Copy over all of the original dealerType properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      const dealerType = { ...this.dealerType, ...this.dealerTypeForm.value };

      if (dealerType.DealerTypeId === 0) {
        this.store.dispatch(new dealerTypeActions.CreateDealerType(dealerType));
      } else {
        this.store.dispatch(new dealerTypeActions.UpdateDealerType(dealerType));
      }

      //this.dialogRef.close(dealerType);
      //}
    } else {
      this.errorMessage$ = of('Please correct the validation errors.');
    }
  }

  dismiss(): void {
    // Redisplay the currently selected dealerType
    // replacing any edits made
    //this.displayDealerType(this.dealerType);
    this.store.dispatch(new dealerTypeActions.ClearCurrentDealerType());
    this.dialogRef.close(null);
  }

}
