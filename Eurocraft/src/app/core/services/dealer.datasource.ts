import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { Dealer } from '../models/dealer';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class DealersDataSource implements DataSource<Dealer> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<Dealer[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getDealers);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
