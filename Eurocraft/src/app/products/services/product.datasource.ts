import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { Product } from '../models/product';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class ProductsDataSource implements DataSource<Product> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<Product[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getProducts);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
