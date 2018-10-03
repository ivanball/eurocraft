import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { CurrencyPipe } from "@angular/common";
import { Observable, of } from "rxjs";
import { takeWhile } from "rxjs/operators";

import { Store, select } from "@ngrx/store";
import * as reducers from "../../store/reducers";
import * as selectors from "../../store/selectors";
import * as addressTypeActions from "../../store/actions/addresstype.actions";
import * as phoneNumberTypeActions from "../../store/actions/phonenumbertype.actions";
import * as stateProvinceActions from "../../store/actions/stateprovince.actions";
import * as vendorActions from "../../store/actions/vendor.actions";

import { GenericValidator } from "../../../shared/generic-validator";
import { AddressType } from "../../models/addresstype";
import { PhoneNumberType } from "../../models/phonenumbertype";
import { StateProvince } from "../../models/stateprovince";
import { Vendor } from "../../models/vendor";

@Component({
  selector: "app-vendor-dialog",
  templateUrl: "./vendor-dialog.component.html",
  styleUrls: ["./vendor-dialog.component.scss"]
})
export class VendorDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = "Vendor Edit";
  errorMessage$: Observable<string>;
  componentActive = true;
  vendorForm: FormGroup;

  vendor: Vendor | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  addressTypes: AddressType[];
  phoneNumberTypes: PhoneNumberType[];
  stateProvinces: StateProvince[];

  constructor(
    private fb: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private dialogRef: MatDialogRef<VendorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>
  ) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      VendorName: {
        required: "Vendor name is required.",
        minlength: "Vendor name must be at least three characters.",
        maxlength: "Vendor name cannot exceed 50 characters."
      },
      PricingLevel: {
        pattern: "Pricing Level must be a number less than 999,999"
      },
      CreditAmount: {
        pattern:
          "Credit Amount must be a currency amount less than $999,999,999,999.99"
      },
      FirstName: {
        required: "First Name is required."
      },
      LastName: {
        required: "Last Name is required."
      },
      EmailAddress: {
        required: "Email address is required.",
        pattern: "Email address must be a valid email address.",
        maxlength: "Email address cannot exceed 50 characters."
      },
      PhoneNumberTypeId: {
        required: "PhoneNumber Type is required."
      },
      PhoneNumber: {
        required: "Phone number is required.",
        pattern: "Phone number must be a valid phone number.",
        maxlength: "Phone number cannot exceed 50 characters."
      },
      AddressTypeId: {
        required: "Address Type is required."
      },
      AddressLine1: {
        required: "Address Line 1 is required."
      },
      AddressCity: {
        required: "City 1 is required."
      },
      StateProvinceId: {
        required: "State is required."
      },
      PostalCode: {
        required: "Postal Code is required.",
        pattern: "Postal code must be a valid postal code."
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  get Contacts(): FormArray {
    return <FormArray>this.vendorForm.get("BusinessEntity.Contacts");
  }

  addContact(): void {
    this.Contacts.push(this.buildContact());

    var index = this.Contacts.length - 1;
    var setFocusToLastArrayElement = function() {
      if (document.getElementById("Title" + index) != undefined) {
        // run when condition is met
        document.getElementById("Title" + index).focus();
        return;
      } else {
        setTimeout(setFocusToLastArrayElement, 100); // check again in 100 miliseconds
      }
    };

    setFocusToLastArrayElement();
  }

  buildContact(): FormGroup {
    return this.fb.group({
      BusinessEntityContactId: 0,
      BusinessEntityId: 0,
      PersonId: 0,
      Person: this.fb.group({
        BusinessEntityId: 0,
        Title: "",
        FirstName: ["", [Validators.required]],
        MiddleName: "",
        LastName: ["", [Validators.required]],
        Suffix: "",
        JobTitle: ""
      })
    });
  }

  removeContact(line: number): void {
    this.Contacts.removeAt(line);
  }

  get EmailAddresses(): FormArray {
    return <FormArray>this.vendorForm.get("BusinessEntity.EmailAddresses");
  }

  addEmailAddress(): void {
    this.EmailAddresses.push(this.buildEmailAddress());

    var index = this.EmailAddresses.length - 1;
    var setFocusToLastArrayElement = function() {
      if (document.getElementById("EmailAddress_" + index) != undefined) {
        // run when condition is met
        document.getElementById("EmailAddress_" + index).focus();
        return;
      } else {
        setTimeout(setFocusToLastArrayElement, 100); // check again in 100 miliseconds
      }
    };

    setFocusToLastArrayElement();
  }

  buildEmailAddress(): FormGroup {
    return this.fb.group({
      BusinessEntityEmailId: 0,
      BusinessEntityId: 0,
      EmailAddress: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern("^[^ @]+@[^ @]+[.][^ @]+$")
        ]
      ]
    });
  }

  removeEmailAddress(line: number): void {
    this.EmailAddresses.removeAt(line);
  }

  get PhoneNumbers(): FormArray {
    return <FormArray>this.vendorForm.get("BusinessEntity.PhoneNumbers");
  }

  addPhoneNumber(): void {
    this.PhoneNumbers.push(this.buildPhoneNumber());

    var index = this.PhoneNumbers.length - 1;
    var setFocusToLastArrayElement = function() {
      if (document.getElementById("PhoneNumberTypeId_" + index) != undefined) {
        // run when condition is met
        document.getElementById("PhoneNumberTypeId_" + index).focus();
        return;
      } else {
        setTimeout(setFocusToLastArrayElement, 100); // check again in 100 miliseconds
      }
    };

    setFocusToLastArrayElement();
  }

  buildPhoneNumber(): FormGroup {
    return this.fb.group({
      BusinessEntityPhoneId: 0,
      BusinessEntityId: 0,
      PhoneNumber: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(
            "^1?[- ]?[(]?([0-9]{3})[)]?[- ]?([0-9]{3})[- ]?([0-9]{4})$"
          )
        ]
      ],
      PhoneNumberTypeId: [null, [Validators.required]]
    });
  }

  removePhoneNumber(line: number): void {
    this.PhoneNumbers.removeAt(line);
  }

  get Addresses(): FormArray {
    return <FormArray>this.vendorForm.get("BusinessEntity.Addresses");
  }

  addAddress(): void {
    this.Addresses.push(this.buildAddress());

    var index = this.Addresses.length - 1;
    var setFocusToLastArrayElement = function() {
      if (document.getElementById("AddressTypeId_" + index) != undefined) {
        // run when condition is met
        document.getElementById("AddressTypeId_" + index).focus();
        return;
      } else {
        setTimeout(setFocusToLastArrayElement, 100); // check again in 100 miliseconds
      }
    };

    setFocusToLastArrayElement();
  }

  buildAddress(): FormGroup {
    return this.fb.group({
      BusinessEntityAddressId: 0,
      BusinessEntityId: 0,
      AddressId: 0,
      AddressTypeId: [null, [Validators.required]],
      Address: this.fb.group({
        AddressId: 0,
        AddressLine1: ["", [Validators.required]],
        AddressLine2: "",
        AddressCity: ["", [Validators.required]],
        StateProvinceId: [null, [Validators.required]],
        PostalCode: ["", [Validators.required]] // , Validators.pattern('^[0-9]{5}(?:[- ][0-9]{4})?$')]]
      })
    });
  }

  removeAddress(line: number): void {
    this.Addresses.removeAt(line);
  }

  ngOnInit(): void {
    this.store.dispatch(new addressTypeActions.LoadAddressTypeAll());
    this.store
      .pipe(
        select(selectors.getAddressTypesAll),
        takeWhile(() => this.componentActive)
      )
      .subscribe((addressTypes: AddressType[]) => {
        this.addressTypes = addressTypes;
      });

    this.store.dispatch(new phoneNumberTypeActions.LoadPhoneNumberTypeAll());
    this.store
      .pipe(
        select(selectors.getPhoneNumberTypesAll),
        takeWhile(() => this.componentActive)
      )
      .subscribe((phoneNumberTypes: PhoneNumberType[]) => {
        this.phoneNumberTypes = phoneNumberTypes;
      });

    this.store.dispatch(new stateProvinceActions.LoadStateProvinceAll());
    this.store
      .pipe(
        select(selectors.getStateProvincesAll),
        takeWhile(() => this.componentActive)
      )
      .subscribe((stateProvinces: StateProvince[]) => {
        this.stateProvinces = stateProvinces;
      });

    this.vendorForm = this.fb.group({
      VendorName: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      AccountNumber: "",
      Website: "",
      IsTaxExempt: false,
      PaymentTerms: "",
      PricingLevel: [
        null,
        [Validators.pattern("^[-+]?[0-9]{0,6}([,][0-9]{3}){0,1}([.][0-9]*)?$")]
      ],
      CreditAmount: [
        null,
        [
          Validators.pattern(
            "^[-+]?[$]?[0-9]{0,12}([,][0-9]{3}){0,3}([.][0-9]*)?$"
          )
        ]
      ],
      BusinessEntity: this.fb.group({
        Contacts: this.fb.array([]),
        EmailAddresses: this.fb.array([]),
        PhoneNumbers: this.fb.array([]),
        Addresses: this.fb.array([])
      }),
      PhoneNumber: null,
      AddressCity: null
});

    // Watch for changes to the currently selected vendor
    this.store
      .pipe(
        select(selectors.getCurrentVendor),
        takeWhile(() => this.componentActive)
      )
      .subscribe(currentVendor => this.displayVendor(currentVendor));

    this.store
      .pipe(
        select(selectors.getVendorActionSucceeded),
        takeWhile(() => this.componentActive)
      )
      .subscribe(actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.vendor);
        }
      });

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getVendorError));

    // Watch for value changes
    this.vendorForm.valueChanges.subscribe(
      //value => console.log(value)
      value =>
        (this.displayMessage = this.genericValidator.processMessages(
          this.vendorForm
        ))
    );
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  // Also validate on blur
  // Helpful if the user tabs through required fields
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(
      this.vendorForm
    );
  }

  blurCurrency(): void {
    this.blur();
    var creditAmount = this.vendorForm.get("CreditAmount");
    if (creditAmount && creditAmount.value && creditAmount.valid) {
      this.vendorForm.patchValue({
        CreditAmount: this.currencyPipe.transform(
          creditAmount.value.replace(/,/g, ""),
          "USD",
          "symbol-narrow",
          "1.2-2"
        )
      });
    }
  }

  focusCurrency(): void {
    var creditAmount = this.vendorForm.get("CreditAmount");
    if (creditAmount && creditAmount.value) {
      this.vendorForm.patchValue({
        CreditAmount: creditAmount.value.replace("$", "").replace(/,/g, "")
      });
    }
  }

  displayVendor(vendor: Vendor | null): void {
    // Set the local product property
    this.vendor = vendor;

    if (this.vendor) {
      // Reset the form back to pristine
      this.vendorForm.reset();

      // Display the appropriate page title
      if (this.vendor.BusinessEntityId === 0) {
        this.pageTitle = "Add Vendor";
      } else {
        this.pageTitle = `Edit Vendor: ${this.vendor.VendorName}`;
        if (this.Contacts && this.vendor.BusinessEntity.Contacts) {
          while (
            this.Contacts.length < this.vendor.BusinessEntity.Contacts.length
          ) {
            this.Contacts.push(this.buildContact());
          }
        }
        if (this.EmailAddresses && this.vendor.BusinessEntity.EmailAddresses) {
          while (
            this.EmailAddresses.length <
            this.vendor.BusinessEntity.EmailAddresses.length
          ) {
            this.EmailAddresses.push(this.buildEmailAddress());
          }
        }
        if (this.PhoneNumbers && this.vendor.BusinessEntity.PhoneNumbers) {
          while (
            this.PhoneNumbers.length <
            this.vendor.BusinessEntity.PhoneNumbers.length
          ) {
            this.PhoneNumbers.push(this.buildPhoneNumber());
          }
        }
        if (this.Addresses && this.vendor.BusinessEntity.Addresses) {
          while (
            this.Addresses.length < this.vendor.BusinessEntity.Addresses.length
          ) {
            this.Addresses.push(this.buildAddress());
          }
        }
      }

      // Update the data on the form
      this.vendorForm.patchValue({
        VendorName: this.vendor.VendorName,
        AccountNumber: this.vendor.AccountNumber,
        Website: this.vendor.Website,
        IsTaxExempt: this.vendor.IsTaxExempt == "Y",
        PaymentTerms: this.vendor.PaymentTerms,
        PricingLevel: this.vendor.PricingLevel,
        CreditAmount: this.currencyPipe.transform(
          this.vendor.CreditAmount,
          "USD",
          "symbol-narrow",
          "1.2-2"
        ),
        BusinessEntity: this.vendor.BusinessEntity
      });
    }
  }

  save(): void {
    if (this.vendorForm.valid) {
      //if (this.vendorForm.dirty) {
      // Copy over all of the original vendor properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      var pricingLevel = this.vendorForm.get("PricingLevel");
      var creditAmount = this.vendorForm.get("CreditAmount");
      const vendor = {
        ...this.vendor,
        ...this.vendorForm.value,
        IsTaxExempt: this.vendorForm.get("IsTaxExempt").value ? "Y" : "N",
        PricingLevel:
          pricingLevel && pricingLevel.value
            ? parseFloat(pricingLevel.value)
            : null,
        CreditAmount:
          creditAmount && creditAmount.value
            ? parseFloat(creditAmount.value.replace("$", "").replace(/,/g, ""))
            : null
      };

      if (vendor.BusinessEntityId === 0) {
        this.store.dispatch(new vendorActions.CreateVendor(vendor));
      } else {
        this.store.dispatch(new vendorActions.UpdateVendor(vendor));
      }

      //this.dialogRef.close(vendor);
      //}
    } else {
      this.errorMessage$ = of("Please correct the validation errors.");
    }
  }

  dismiss(): void {
    // Redisplay the currently selected product
    // replacing any edits made
    //this.displayVendor(this.vendor);
    this.store.dispatch(new vendorActions.ClearCurrentVendor());
    this.dialogRef.close(null);
  }
}
