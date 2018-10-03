import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { ProductUse } from '../models/productuse';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class ProductUsesDataSource implements DataSource<ProductUse> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<ProductUse[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getProductUses);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
