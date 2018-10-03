import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { AddressType } from '../models/addresstype';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class AddressTypesDataSource implements DataSource<AddressType> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<AddressType[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getAddressTypes);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
