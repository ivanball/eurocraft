import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as salesOrderDetailActions from '../../store/actions/salesorderdetail.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SalesOrderDetail } from '../../models/salesorderdetail';
import { SalesOrderDetailDialogComponent } from '../salesorderdetail-dialog/salesorderdetail-dialog.component';
import { SalesOrderDetailsDataSource } from "../../services/salesorderdetail.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'OrderQty', showInSmallScreen: true },
  { columnName: 'ProductName', showInSmallScreen: true },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-salesorderdetail-list',
  templateUrl: './salesorderdetail-list.component.html',
  styleUrls: ['./salesorderdetail-list.component.scss']
})
export class SalesOrderDetailListComponent implements OnInit, OnDestroy {
  pageTitle = 'Sales Order Details';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentSalesOrderDetail: SalesOrderDetail | null;
  dataSource: SalesOrderDetailsDataSource;
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
    // .subscribe((coreState: SalesOrderDetailsState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getSalesOrderDetailError));
    this.loading$ = this.store.pipe(select(selectors.getSalesOrderDetailLoading));

    //this.currentSalesOrderDetail$ = this.store.select(fromSalesOrder.getCurrentSalesOrder);

    this.dataSource = new SalesOrderDetailsDataSource(this.store);

    this.store.dispatch(new salesOrderDetailActions.LoadSalesOrderDetail());

    this.store.pipe(
      select(selectors.getCurrentSalesOrderDetail),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentSalesOrderDetail => this.currentSalesOrderDetail = currentSalesOrderDetail
    );

    this.store.pipe(
      select(selectors.getSalesOrderDetailCount),
      takeWhile(() => this.componentActive)
    ).subscribe((salesOrdersCount: number) => {
      this.paginator.length = salesOrdersCount;
    }
    );

    this.store.pipe(
      select(selectors.getSalesOrderDetailDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((salesOrderDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = salesOrderDataSourceParameters.pageIndex;
      this.paginator.pageSize = salesOrderDataSourceParameters.pageSize;
      this.filters = salesOrderDataSourceParameters.filters;
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
          this.loadSalesOrderDetails();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadSalesOrderDetails())
      )
      .subscribe();
  }

  loadSalesOrderDetails(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new salesOrderDetailActions.SetSalesOrderDetailDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openSalesOrderDetailDialog(): void {
    let dialogRef = this.dialog.open(SalesOrderDetailDialogComponent, {
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
        this.openSnackBar("SalesOrder saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/salesOrders', result.SalesOrderId]);
          });
      }
    });
  }

  newSalesOrderDetail(): void {
    this.store.dispatch(new salesOrderDetailActions.InitializeCurrentSalesOrderDetail());

    this.openSalesOrderDetailDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  salesOrderSelected(salesOrderDetail: SalesOrderDetail): void {
    this.store.dispatch(new salesOrderDetailActions.SetCurrentSalesOrderDetail(salesOrderDetail));
  }

  updateSalesOrder(salesOrderDetail: SalesOrderDetail): void {
    this.salesOrderSelected(salesOrderDetail);

    this.openSalesOrderDetailDialog();
  }

  deleteSalesOrder(salesOrderDetail: SalesOrderDetail): void {
    this.salesOrderSelected(salesOrderDetail);
    if (this.currentSalesOrderDetail && this.currentSalesOrderDetail.SalesOrderId) {
      if (confirm(`Really delete the product subcategory: ${this.currentSalesOrderDetail.SalesOrderDetailId}?`)) {
        this.store.dispatch(new salesOrderDetailActions.DeleteSalesOrderDetail(this.currentSalesOrderDetail.SalesOrderId));
      }
    }
  }

}
