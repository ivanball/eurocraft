import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as countryRegionActions from '../../store/actions/countryregion.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { CountryRegion } from '../../models/countryregion';
import { CountryRegionDialogComponent } from '../countryregion-dialog/countryregion-dialog.component';
import { CountryRegionsDataSource } from "../../services/countryregion.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'CountryRegionCode', showInSmallScreen: true },
  { columnName: 'CountryRegionName', showInSmallScreen: true },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-countryregion-list',
  templateUrl: './countryregion-list.component.html',
  styleUrls: ['./countryregion-list.component.scss']
})
export class CountryRegionListComponent implements OnInit, OnDestroy {
  pageTitle = 'Country/Regions';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentCountryRegion: CountryRegion | null;
  dataSource: CountryRegionsDataSource;
  filters: FilteredColumn[] = [];

  private mediaMatcher: MediaQueryList =
    matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  constructor(
    zone: NgZone,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store<reducers.State>) {
    this.mediaMatcher.addListener(mql =>
      zone.run(() => this.mediaMatcher = mql));
  }

  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }

  getDisplayedColumns(): string[] {
    return columnDefinitions
      .filter(cd => !this.isScreenSmall() || cd.showInSmallScreen)
      .map(cd => cd.columnName);
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  onRowClicked(row) {
    //    console.log('Row clicked: ', row);
  }

  ngOnInit() {
    // this.store.pipe(select<any>('core'))
    // .subscribe((coreState: CountryRegionsState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getCountryRegionError));
    this.loading$ = this.store.pipe(select(selectors.getCountryRegionLoading));

    //this.currentCountryRegion$ = this.store.select(fromCountryRegion.getCurrentCountryRegion);

    this.dataSource = new CountryRegionsDataSource(this.store);

    this.store.dispatch(new countryRegionActions.LoadCountryRegion());

    this.store.pipe(
      select(selectors.getCurrentCountryRegion),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentCountryRegion => this.currentCountryRegion = currentCountryRegion
    );

    this.store.pipe(
      select(selectors.getCountryRegionCount),
      takeWhile(() => this.componentActive)
    ).subscribe((countryRegionsCount: number) => {
      this.paginator.length = countryRegionsCount;
    }
    );

    this.store.pipe(
      select(selectors.getCountryRegionDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((countryRegionDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = countryRegionDataSourceParameters.pageIndex;
      this.paginator.pageSize = countryRegionDataSourceParameters.pageSize;
      this.filters = countryRegionDataSourceParameters.filters;
    }
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  ngAfterViewInit() {
    for (let column of this.filters) {
      var prevFilterValue = ((document.getElementById(column.ColumnName + "Search") as HTMLInputElement).value);
      if (column.FilterValue != prevFilterValue) {
        (document.getElementById(column.ColumnName + "Search") as HTMLInputElement).value = column.FilterValue;
      }
    }

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    const searchInputs = document.getElementsByClassName('searchInput');
    fromEvent(searchInputs, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadCountryRegions();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadCountryRegions())
      )
      .subscribe();
  }

  loadCountryRegions(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new countryRegionActions.SetCountryRegionDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openCountryRegionDialog(): void {
    let dialogRef = this.dialog.open(CountryRegionDialogComponent, {
      width: '450px',
      autoFocus: true,
      disableClose: true,
      data: {
        id: "6"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed', result);

      if (result) {
        this.openSnackBar("CountryRegion saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/countryRegions', result.CountryRegionId]);
          });
      }
    });
  }

  newCountryRegion(): void {
    this.store.dispatch(new countryRegionActions.InitializeCurrentCountryRegion());

    this.openCountryRegionDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  countryRegionSelected(countryRegion: CountryRegion): void {
    this.store.dispatch(new countryRegionActions.SetCurrentCountryRegion(countryRegion));
  }

  updateCountryRegion(countryRegion: CountryRegion): void {
    this.countryRegionSelected(countryRegion);

    this.openCountryRegionDialog();
  }

  deleteCountryRegion(countryRegion: CountryRegion): void {
    this.countryRegionSelected(countryRegion);
    if (this.currentCountryRegion && this.currentCountryRegion.CountryRegionId) {
      if (confirm(`Really delete the country/region: ${this.currentCountryRegion.CountryRegionName}?`)) {
        this.store.dispatch(new countryRegionActions.DeleteCountryRegion(this.currentCountryRegion.CountryRegionId));
      }
    }
  }

}
