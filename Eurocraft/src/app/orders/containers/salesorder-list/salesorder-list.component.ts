import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  OnDestroy,
  ElementRef
} from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatDialog,
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar
} from "@angular/material";

import { Store, select } from "@ngrx/store";
import * as reducers from "../../store/reducers";
import * as selectors from "../../store/selectors";
import * as salesOrderHeaderActions from "../../store/actions/salesorderheader.actions";

import { Observable, fromEvent, merge } from "rxjs";
import {
  takeWhile,
  debounceTime,
  distinctUntilChanged,
  tap
} from "rxjs/operators";
import { SalesOrderHeader } from "../../models/salesorderheader";
import { SalesOrderDialogComponent } from "../salesorder-dialog/salesorder-dialog.component";
import { SalesOrderHeadersDataSource } from "../../services/salesorderheader.datasource";
import {
  DataSourceParameters,
  FilteredColumn
} from "../../../shared/datasource.parameters";

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: "SalesOrderNo", showInSmallScreen: true },
  { columnName: "DealerName", showInSmallScreen: true },
  { columnName: "OrderDate", showInSmallScreen: true },
  { columnName: "TotalDue", showInSmallScreen: true },
  { columnName: "ActionUpdate", showInSmallScreen: true },
  { columnName: "ActionDelete", showInSmallScreen: true }
];

@Component({
  selector: "app-salesorder-list",
  templateUrl: "./salesorder-list.component.html",
  styleUrls: ["./salesorder-list.component.scss"]
})
export class SalesOrderListComponent implements OnInit, OnDestroy {
  pageTitle = "Sales Orders";
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentSalesOrderHeader: SalesOrderHeader | null;
  dataSource: SalesOrderHeadersDataSource;
  filters: FilteredColumn[] = [];

  private mediaMatcher: MediaQueryList = matchMedia(
    `(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`
  );

  constructor(
    zone: NgZone,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store<reducers.State>
  ) {
    this.mediaMatcher.addListener(mql =>
      zone.run(() => (this.mediaMatcher = mql))
    );
  }

  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }

  getDisplayedColumns(): string[] {
    return columnDefinitions
      .filter(cd => !this.isScreenSmall() || cd.showInSmallScreen)
      .map(cd => cd.columnName);
  }

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;

  onRowClicked(row) {
    //    console.log('Row clicked: ', row);
  }

  ngOnInit() {
    // this.store.pipe(select<any>('core'))
    // .subscribe((coreState: SalesOrdersState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(
      select(selectors.getSalesOrderHeaderError)
    );
    this.loading$ = this.store.pipe(
      select(selectors.getSalesOrderHeaderLoading)
    );

    //this.currentSalesOrderHeader$ = this.store.select(fromSalesOrder.getCurrentSalesOrder);

    this.dataSource = new SalesOrderHeadersDataSource(this.store);

    this.store.dispatch(new salesOrderHeaderActions.LoadSalesOrderHeader());

    this.store
      .pipe(
        select(selectors.getCurrentSalesOrderHeader),
        takeWhile(() => this.componentActive)
      )
      .subscribe(
        currentSalesOrderHeader =>
          (this.currentSalesOrderHeader = currentSalesOrderHeader)
      );

    this.store
      .pipe(
        select(selectors.getSalesOrderHeaderCount),
        takeWhile(() => this.componentActive)
      )
      .subscribe((salesOrdersCount: number) => {
        this.paginator.length = salesOrdersCount;
      });

    this.store
      .pipe(
        select(selectors.getSalesOrderHeaderDataSourceParameters),
        takeWhile(() => this.componentActive)
      )
      .subscribe((salesOrderDataSourceParameters: DataSourceParameters) => {
        this.paginator.pageIndex = salesOrderDataSourceParameters.pageIndex;
        this.paginator.pageSize = salesOrderDataSourceParameters.pageSize;
        this.filters = salesOrderDataSourceParameters.filters;
      });
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  ngAfterViewInit() {
    for (let column of this.filters) {
      var prevFilterValue = (document.getElementById(
        column.ColumnName + "Search"
      ) as HTMLInputElement).value;
      if (column.FilterValue != prevFilterValue) {
        (document.getElementById(
          column.ColumnName + "Search"
        ) as HTMLInputElement).value = column.FilterValue;
      }
    }

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    const searchInputs = document.getElementsByClassName("searchInput");
    fromEvent(searchInputs, "keyup")
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadSalesOrders();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadSalesOrders()))
      .subscribe();
  }

  loadSalesOrders(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf("Action") < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = (document.getElementById(
          columnName + "Search"
        ) as HTMLInputElement).value;
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(
      new salesOrderHeaderActions.SetSalesOrderHeaderDataSourceParameters(
        new DataSourceParameters(
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize,
          _filters
        )
      )
    );
  }

  openSalesOrderDialog(): void {
    let dialogRef = this.dialog.open(SalesOrderDialogComponent, {
      width: "450px",
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
          .onAction()
          .subscribe(() => {
            //            this.router.navigate(['/salesOrders', result.SalesOrderId]);
          });
      }
    });
  }

  newSalesOrder(): void {
    this.store.dispatch(
      new salesOrderHeaderActions.InitializeCurrentSalesOrderHeader()
    );

    this.openSalesOrderDialog();
  }

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000
    });
  }

  salesOrderSelected(salesOrderHeader: SalesOrderHeader): void {
    this.store.dispatch(
      new salesOrderHeaderActions.SetCurrentSalesOrderHeader(salesOrderHeader)
    );
  }

  updateSalesOrder(salesOrderHeader: SalesOrderHeader): void {
    this.salesOrderSelected(salesOrderHeader);

    this.openSalesOrderDialog();
  }

  deleteSalesOrder(salesOrderHeader: SalesOrderHeader): void {
    this.salesOrderSelected(salesOrderHeader);
    if (
      this.currentSalesOrderHeader &&
      this.currentSalesOrderHeader.SalesOrderId
    ) {
      if (
        confirm(
          `Really delete the product subcategory: ${
            this.currentSalesOrderHeader.SalesOrderNo
          }?`
        )
      ) {
        this.store.dispatch(
          new salesOrderHeaderActions.DeleteSalesOrderHeader(
            this.currentSalesOrderHeader.SalesOrderId
          )
        );
      }
    }
  }
}
