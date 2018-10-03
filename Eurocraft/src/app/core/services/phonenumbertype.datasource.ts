import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { PhoneNumberType } from '../models/phonenumbertype';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class PhoneNumberTypesDataSource implements DataSource<PhoneNumberType> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<PhoneNumberType[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getPhoneNumberTypes);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
