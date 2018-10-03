import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { SalesOrderDetail } from '../models/salesorderdetail';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class SalesOrderDetailsDataSource implements DataSource<SalesOrderDetail> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<SalesOrderDetail[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getSalesOrderDetails);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
