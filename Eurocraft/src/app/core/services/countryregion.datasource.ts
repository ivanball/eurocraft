import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

import { CountryRegion } from '../models/countryregion';
import * as reducers from '../store/reducers';
import * as selectors from '../store/selectors';

export class CountryRegionsDataSource implements DataSource<CountryRegion> {

    constructor(private store: Store<reducers.State>) { }

    connect(collectionViewer: CollectionViewer): Observable<CountryRegion[]> {
        //console.log("Connecting data source");
        return this.store.select(selectors.getCountryRegions);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}
