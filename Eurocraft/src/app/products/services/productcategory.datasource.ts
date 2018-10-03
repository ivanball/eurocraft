import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { ProductCategory } from '../models/productcategory';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class ProductCategoriesDataSource implements DataSource<ProductCategory> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<ProductCategory[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getProductCategories);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
