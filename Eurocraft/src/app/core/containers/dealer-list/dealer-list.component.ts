import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as dealerActions from '../../store/actions/dealer.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Dealer } from '../../models/dealer';
import { DealerDialogComponent } from '../dealer-dialog/dealer-dialog.component';
import { DealersDataSource } from "../../services/dealer.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'DealerName', showInSmallScreen: true },
  { columnName: "PhoneNumber", showInSmallScreen: true },
  { columnName: "AddressCity", showInSmallScreen: true },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-dealer-list',
  templateUrl: './dealer-list.component.html',
  styleUrls: ['./dealer-list.component.scss']
})
export class DealerListComponent implements OnInit, OnDestroy {
  pageTitle = 'Dealers';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentDealer: Dealer | null;
  dealers: Dealer[];
  dataSource: DealersDataSource;
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
    // .subscribe((coreState: CoreState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));


    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getDealerError));
    this.loading$ = this.store.pipe(select(selectors.getDealerLoading));

    //this.currentDealer$ = this.store.select(fromDealer.getCurrentDealer);

    this.dataSource = new DealersDataSource(this.store);

    this.store.dispatch(new dealerActions.LoadDealer());
    this.store.pipe(
      select(selectors.getDealers),
      takeWhile(() => this.componentActive)
    ).subscribe((dealers: Dealer[]) => {
      this.dealers = dealers;
    }
    );

    this.store.pipe(
      select(selectors.getCurrentDealer),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentDealer => this.currentDealer = currentDealer
    );

    this.store.pipe(
      select(selectors.getDealerCount),
      takeWhile(() => this.componentActive)
    ).subscribe((dealersCount: number) => {
      this.paginator.length = dealersCount;
    }
    );

    this.store.pipe(
      select(selectors.getDealerDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((dealerDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = dealerDataSourceParameters.pageIndex;
      this.paginator.pageSize = dealerDataSourceParameters.pageSize;
      this.filters = dealerDataSourceParameters.filters;
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
          this.loadDealers();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadDealers())
      )
      .subscribe();
  }

  loadDealers(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new dealerActions.SetDealerDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openDealerDialog(): void {
    let dialogRef = this.dialog.open(DealerDialogComponent, {
      width: '450px',
      autoFocus: true,
      disableClose: true,
      data: {
        id: "6",
        dealers: this.dealers,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed', result);

      if (result) {
        this.openSnackBar("Dealer saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/dealers', result.BusinessEntityId]);
          });
      }
    });
  }

  newDealer(): void {
    this.store.dispatch(new dealerActions.InitializeCurrentDealer());

    this.openDealerDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  dealerSelected(dealer: Dealer): void {
    this.store.dispatch(new dealerActions.SetCurrentDealer(dealer));
  }

  updateDealer(dealer: Dealer): void {
    this.dealerSelected(dealer);

    this.openDealerDialog();
  }

  deleteDealer(dealer: Dealer): void {
    this.dealerSelected(dealer);
    if (this.currentDealer && this.currentDealer.BusinessEntityId) {
      if (confirm(`Really delete the dealer: ${this.currentDealer.DealerName}?`)) {
        this.store.dispatch(new dealerActions.DeleteDealer(this.currentDealer.BusinessEntityId));
      }
    }
  }

}
