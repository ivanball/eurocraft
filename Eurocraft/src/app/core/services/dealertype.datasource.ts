import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { DealerType } from '../models/dealertype';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class DealerTypesDataSource implements DataSource<DealerType> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<DealerType[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getDealerTypes);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
