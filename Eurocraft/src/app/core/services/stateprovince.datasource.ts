import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { StateProvince } from '../models/stateprovince';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class StateProvincesDataSource implements DataSource<StateProvince> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<StateProvince[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getStateProvinces);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
