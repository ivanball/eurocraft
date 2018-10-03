import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { PaymentType } from '../models/paymenttype';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class PaymentTypesDataSource implements DataSource<PaymentType> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<PaymentType[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getPaymentTypes);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
