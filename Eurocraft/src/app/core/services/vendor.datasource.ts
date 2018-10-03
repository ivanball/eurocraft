import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { Vendor } from '../models/vendor';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class VendorsDataSource implements DataSource<Vendor> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<Vendor[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getVendors);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
