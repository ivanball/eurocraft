import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { ProductModel } from '../models/productmodel';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class ProductModelsDataSource implements DataSource<ProductModel> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<ProductModel[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getProductModels);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
