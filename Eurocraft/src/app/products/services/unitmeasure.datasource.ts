import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { UnitMeasure } from '../models/unitmeasure';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class UnitMeasuresDataSource implements DataSource<UnitMeasure> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<UnitMeasure[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getUnitMeasures);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
