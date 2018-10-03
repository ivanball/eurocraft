import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { ProductType } from '../models/producttype';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class ProductTypesDataSource implements DataSource<ProductType> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<ProductType[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getProductTypes);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
