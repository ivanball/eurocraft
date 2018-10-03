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
import * as dealerTypeActions from "../../store/actions/dealertype.actions";
import * as phoneNumberTypeActions from "../../store/actions/phonenumbertype.actions";
import * as stateProvinceActions from "../../store/actions/stateprovince.actions";
import * as dealerActions from "../../store/actions/dealer.actions";

import { GenericValidator } from "../../../shared/generic-validator";
import { AddressType } from "../../models/addresstype";
import { DealerType } from "../../models/dealertype";
import { PhoneNumberType } from "../../models/phonenumbertype";
import { StateProvince } from "../../models/stateprovince";
import { Dealer } from "../../models/dealer";

@Component({
  selector: "app-dealer-dialog",
  templateUrl: "./dealer-dialog.component.html",
  styleUrls: ["./dealer-dialog.component.scss"]
})
export class DealerDialogComponent implements OnInit, OnDestroy {
  pageTitle: string = "Dealer Edit";
  errorMessage$: Observable<string>;
  componentActive = true;
  dealerForm: FormGroup;

  dealer: Dealer | null;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  dealers: Dealer[];
  addressTypes: AddressType[];
  dealerTypes: DealerType[];
  phoneNumberTypes: PhoneNumberType[];
  stateProvinces: StateProvince[];

  constructor(
    private fb: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private dialogRef: MatDialogRef<DealerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private store: Store<reducers.State>
  ) {
    //console.log('data passed in is:', this.data);

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      DealerName: {
        required: "Dealer name is required.",
        minlength: "Dealer name must be at least three characters.",
        maxlength: "Dealer name cannot exceed 50 characters."
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
    return <FormArray>this.dealerForm.get("BusinessEntity.Contacts");
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
    return <FormArray>this.dealerForm.get("BusinessEntity.EmailAddresses");
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
    return <FormArray>this.dealerForm.get("BusinessEntity.PhoneNumbers");
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
    return <FormArray>this.dealerForm.get("BusinessEntity.Addresses");
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
    this.store.dispatch(new dealerActions.LoadDealerAll());
    this.store
      .pipe(
        select(selectors.getDealersAll),
        takeWhile(() => this.componentActive)
      )
      .subscribe((dealers: Dealer[]) => {
        this.dealers = dealers;
        if (this.dealer) {
          this.dealers = this.dealers.filter(
            dealer => dealer.BusinessEntityId != this.dealer.BusinessEntityId
          );
        }
      });

    this.store.dispatch(new addressTypeActions.LoadAddressTypeAll());
    this.store
      .pipe(
        select(selectors.getAddressTypesAll),
        takeWhile(() => this.componentActive)
      )
      .subscribe((addressTypes: AddressType[]) => {
        this.addressTypes = addressTypes;
      });

    this.store.dispatch(new dealerTypeActions.LoadDealerTypeAll());
    this.store
      .pipe(
        select(selectors.getDealerTypesAll),
        takeWhile(() => this.componentActive)
      )
      .subscribe((dealerTypes: DealerType[]) => {
        this.dealerTypes = dealerTypes;
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

    this.dealerForm = this.fb.group({
      ParentBusinessEntityId: null,
      DealerName: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ],
      DealerTypeId: null,
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

    // Watch for changes to the currently selected dealer
    this.store
      .pipe(
        select(selectors.getCurrentDealer),
        takeWhile(() => this.componentActive)
      )
      .subscribe(currentDealer => this.displayDealer(currentDealer));

    this.store
      .pipe(
        select(selectors.getDealerActionSucceeded),
        takeWhile(() => this.componentActive)
      )
      .subscribe(actionSucceeded => {
        if (actionSucceeded) {
          this.dialogRef.close(this.dealer);
        }
      });

    // Watch for changes to the error message
    this.errorMessage$ = this.store.pipe(select(selectors.getDealerError));

    // Watch for value changes
    this.dealerForm.valueChanges.subscribe(
      //value => console.log(value)
      value =>
        (this.displayMessage = this.genericValidator.processMessages(
          this.dealerForm
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
      this.dealerForm
    );
  }

  blurCurrency(): void {
    this.blur();
    var creditAmount = this.dealerForm.get("CreditAmount");
    if (creditAmount && creditAmount.value && creditAmount.valid) {
      this.dealerForm.patchValue({
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
    var creditAmount = this.dealerForm.get("CreditAmount");
    if (creditAmount && creditAmount.value) {
      this.dealerForm.patchValue({
        CreditAmount: creditAmount.value.replace("$", "").replace(/,/g, "")
      });
    }
  }

  displayDealer(dealer: Dealer | null): void {
    // Set the local product property
    this.dealer = dealer;

    if (this.dealer) {
      // Reset the form back to pristine
      this.dealerForm.reset();

      // Display the appropriate page title
      if (this.dealer.BusinessEntityId === 0) {
        this.pageTitle = "Add Dealer";
      } else {
        this.pageTitle = `Edit Dealer: ${this.dealer.DealerName}`;
        if (this.Contacts && this.dealer.BusinessEntity.Contacts) {
          while (
            this.Contacts.length < this.dealer.BusinessEntity.Contacts.length
          ) {
            this.Contacts.push(this.buildContact());
          }
        }
        if (this.EmailAddresses && this.dealer.BusinessEntity.EmailAddresses) {
          while (
            this.EmailAddresses.length <
            this.dealer.BusinessEntity.EmailAddresses.length
          ) {
            this.EmailAddresses.push(this.buildEmailAddress());
          }
        }
        if (this.PhoneNumbers && this.dealer.BusinessEntity.PhoneNumbers) {
          while (
            this.PhoneNumbers.length <
            this.dealer.BusinessEntity.PhoneNumbers.length
          ) {
            this.PhoneNumbers.push(this.buildPhoneNumber());
          }
        }
        if (this.Addresses && this.dealer.BusinessEntity.Addresses) {
          while (
            this.Addresses.length < this.dealer.BusinessEntity.Addresses.length
          ) {
            this.Addresses.push(this.buildAddress());
          }
        }
      }

      // Update the data on the form
      this.dealerForm.patchValue({
        DealerName: this.dealer.DealerName,
        ParentBusinessEntityId: this.dealer.ParentBusinessEntityId,
        DealerTypeId: this.dealer.DealerTypeId,
        AccountNumber: this.dealer.AccountNumber,
        Website: this.dealer.Website,
        IsTaxExempt: this.dealer.IsTaxExempt == "Y",
        PaymentTerms: this.dealer.PaymentTerms,
        PricingLevel: this.dealer.PricingLevel,
        CreditAmount: this.currencyPipe.transform(
          this.dealer.CreditAmount,
          "USD",
          "symbol-narrow",
          "1.2-2"
        ),
        BusinessEntity: this.dealer.BusinessEntity
      });
    }
  }

  save(): void {
    if (this.dealerForm.valid) {
      //if (this.dealerForm.dirty) {
      // Copy over all of the original dealer properties
      // Then copy over the values from the form
      // This ensures values not on the form, such as the Id, are retained
      var pricingLevel = this.dealerForm.get("PricingLevel");
      var creditAmount = this.dealerForm.get("CreditAmount");
      const dealer = {
        ...this.dealer,
        ...this.dealerForm.value,
        IsTaxExempt: this.dealerForm.get("IsTaxExempt").value ? "Y" : "N",
        PricingLevel:
          pricingLevel && pricingLevel.value
            ? parseFloat(pricingLevel.value)
            : null,
        CreditAmount:
          creditAmount && creditAmount.value
            ? parseFloat(creditAmount.value.replace("$", "").replace(/,/g, ""))
            : null
      };

      if (dealer.BusinessEntityId === 0) {
        this.store.dispatch(new dealerActions.CreateDealer(dealer));
      } else {
        this.store.dispatch(new dealerActions.UpdateDealer(dealer));
      }

      //this.dialogRef.close(dealer);
      //}
    } else {
      this.errorMessage$ = of("Please correct the validation errors.");
    }
  }

  dismiss(): void {
    // Redisplay the currently selected product
    // replacing any edits made
    //this.displayDealer(this.dealer);
    this.store.dispatch(new dealerActions.ClearCurrentDealer());
    this.dialogRef.close(null);
  }
}
