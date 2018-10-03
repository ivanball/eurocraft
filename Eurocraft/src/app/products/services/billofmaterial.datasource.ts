import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { BillOfMaterial } from '../models/billofmaterial';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class BillOfMaterialsDataSource implements DataSource<BillOfMaterial> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<BillOfMaterial[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getBillOfMaterials);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
