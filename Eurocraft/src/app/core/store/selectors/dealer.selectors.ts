import { createSelector } from "@ngrx/store";

import * as fromFeature from "../reducers";
import * as fromDealer from "../reducers/dealer.reducer";
import { BusinessEntity } from "../../models/businessentity";

export const getDealerState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.CoreState) => state.dealerState
);

export const getDealerLoaded = createSelector(
  getDealerState,
  fromDealer.getDealerLoaded
);

export const getDealerLoading = createSelector(
  getDealerState,
  fromDealer.getDealerLoading
);

export const getCurrentDealerId = createSelector(
  getDealerState,
  state => state.currentDealerId
);

export const getCurrentDealer = createSelector(
  getDealerState,
  getCurrentDealerId,
  (state, currentDealerId) => {
    if (currentDealerId === 0) {
      return {
        BusinessEntityId: 0,
        ParentBusinessEntityId: null,
        DealerName: "",
        DealerTypeId: null,
        AccountNumber: "",
        Website: "",
        IsTaxExempt: "N",
        PaymentTerms: "",
        PricingLevel: null,
        CreditAmount: null,
        BusinessEntity: new BusinessEntity(),
        PhoneNumber: null,
        AddressCity: null
      };
    } else {
      return currentDealerId
        ? state.dealers.find(p => p.BusinessEntityId === currentDealerId)
        : null;
    }
  }
);

export const getDealers = createSelector(
  getDealerState,
  state => state.dealers
);

export const getDealersAll = createSelector(
  getDealerState,
  state => state.dealersAll
);

export const getDealerCount = createSelector(
  getDealerState,
  state => state.dealerCount
);

export const getDealerDataSourceParameters = createSelector(
  getDealerState,
  state => state.dealerDataSourceParameters
);

export const getDealerActionSucceeded = createSelector(
  getDealerState,
  fromDealer.getDealerActionSucceeded
);

export const getDealerError = createSelector(
  getDealerState,
  state => state.error
);
