import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { ProductMaterial } from '../models/productmaterial';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class ProductMaterialsDataSource implements DataSource<ProductMaterial> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<ProductMaterial[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getProductMaterials);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
