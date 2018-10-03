import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { SalesOrderHeader } from '../models/salesorderheader';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class SalesOrderHeadersDataSource implements DataSource<SalesOrderHeader> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<SalesOrderHeader[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getSalesOrderHeaders);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
