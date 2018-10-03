import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { ProductSubcategory } from '../models/productsubcategory';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class ProductSubcategoriesDataSource implements DataSource<ProductSubcategory> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<ProductSubcategory[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getProductSubcategories);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
