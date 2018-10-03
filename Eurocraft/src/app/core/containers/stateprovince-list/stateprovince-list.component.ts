import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as stateProvinceActions from '../../store/actions/stateprovince.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { StateProvince } from '../../models/stateprovince';
import { StateProvinceDialogComponent } from '../stateprovince-dialog/stateprovince-dialog.component';
import { StateProvincesDataSource } from "../../services/stateprovince.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'StateProvinceCode', showInSmallScreen: false },
  { columnName: 'StateProvinceName', showInSmallScreen: true },
  { columnName: 'CountryRegionName', showInSmallScreen: true },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-stateprovince-list',
  templateUrl: './stateprovince-list.component.html',
  styleUrls: ['./stateprovince-list.component.scss']
})
export class StateProvinceListComponent implements OnInit, OnDestroy {
  pageTitle = 'State/Provinces';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentStateProvince: StateProvince | null;
  dataSource: StateProvincesDataSource;
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
    // .subscribe((coreState: StateProvincesState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getStateProvinceError));
    this.loading$ = this.store.pipe(select(selectors.getStateProvinceLoading));

    //this.currentStateProvince$ = this.store.select(fromStateProvince.getCurrentStateProvince);

    this.dataSource = new StateProvincesDataSource(this.store);

    this.store.dispatch(new stateProvinceActions.LoadStateProvince());

    this.store.pipe(
      select(selectors.getCurrentStateProvince),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentStateProvince => this.currentStateProvince = currentStateProvince
    );

    this.store.pipe(
      select(selectors.getStateProvinceCount),
      takeWhile(() => this.componentActive)
    ).subscribe((stateProvincesCount: number) => {
      this.paginator.length = stateProvincesCount;
    }
    );

    this.store.pipe(
      select(selectors.getStateProvinceDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((stateProvinceDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = stateProvinceDataSourceParameters.pageIndex;
      this.paginator.pageSize = stateProvinceDataSourceParameters.pageSize;
      this.filters = stateProvinceDataSourceParameters.filters;
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
          this.loadStateProvinces();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadStateProvinces())
      )
      .subscribe();
  }

  loadStateProvinces(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new stateProvinceActions.SetStateProvinceDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openStateProvinceDialog(): void {
    let dialogRef = this.dialog.open(StateProvinceDialogComponent, {
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
        this.openSnackBar("StateProvince saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/stateProvinces', result.StateProvinceId]);
          });
      }
    });
  }

  newStateProvince(): void {
    this.store.dispatch(new stateProvinceActions.InitializeCurrentStateProvince());

    this.openStateProvinceDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  stateProvinceSelected(stateProvince: StateProvince): void {
    this.store.dispatch(new stateProvinceActions.SetCurrentStateProvince(stateProvince));
  }

  updateStateProvince(stateProvince: StateProvince): void {
    this.stateProvinceSelected(stateProvince);

    this.openStateProvinceDialog();
  }

  deleteStateProvince(stateProvince: StateProvince): void {
    this.stateProvinceSelected(stateProvince);
    if (this.currentStateProvince && this.currentStateProvince.StateProvinceId) {
      if (confirm(`Really delete the state/province: ${this.currentStateProvince.StateProvinceName}?`)) {
        this.store.dispatch(new stateProvinceActions.DeleteStateProvince(this.currentStateProvince.StateProvinceId));
      }
    }
  }

}
