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
import * as vendorActions from "../../store/actions/vendor.actions";

import { Observable, fromEvent, merge } from "rxjs";
import {
  takeWhile,
  debounceTime,
  distinctUntilChanged,
  tap
} from "rxjs/operators";
import { Vendor } from "../../models/vendor";
import { VendorDialogComponent } from "../vendor-dialog/vendor-dialog.component";
import { VendorsDataSource } from "../../services/vendor.datasource";
import {
  DataSourceParameters,
  FilteredColumn
} from "../../../shared/datasource.parameters";

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: "VendorName", showInSmallScreen: true },
  { columnName: "PhoneNumber", showInSmallScreen: true },
  { columnName: "AddressCity", showInSmallScreen: true },
  { columnName: "ActionUpdate", showInSmallScreen: true },
  { columnName: "ActionDelete", showInSmallScreen: true }
];

@Component({
  selector: "app-vendor-list",
  templateUrl: "./vendor-list.component.html",
  styleUrls: ["./vendor-list.component.scss"]
})
export class VendorListComponent implements OnInit, OnDestroy {
  pageTitle = "Vendors";
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentVendor: Vendor | null;
  dataSource: VendorsDataSource;
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
    // .subscribe((coreState: CoreState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getVendorError));
    this.loading$ = this.store.pipe(select(selectors.getVendorLoading));

    //this.currentVendor$ = this.store.select(fromVendor.getCurrentVendor);

    this.dataSource = new VendorsDataSource(this.store);

    this.store.dispatch(new vendorActions.LoadVendor());

    this.store
      .pipe(
        select(selectors.getCurrentVendor),
        takeWhile(() => this.componentActive)
      )
      .subscribe(currentVendor => (this.currentVendor = currentVendor));

    this.store
      .pipe(
        select(selectors.getVendorCount),
        takeWhile(() => this.componentActive)
      )
      .subscribe((vendorsCount: number) => {
        this.paginator.length = vendorsCount;
      });

    this.store
      .pipe(
        select(selectors.getVendorDataSourceParameters),
        takeWhile(() => this.componentActive)
      )
      .subscribe((vendorDataSourceParameters: DataSourceParameters) => {
        this.paginator.pageIndex = vendorDataSourceParameters.pageIndex;
        this.paginator.pageSize = vendorDataSourceParameters.pageSize;
        this.filters = vendorDataSourceParameters.filters;
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
          this.loadVendors();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadVendors()))
      .subscribe();
  }

  loadVendors(): void {
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
      new vendorActions.SetVendorDataSourceParameters(
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

  openVendorDialog(): void {
    let dialogRef = this.dialog.open(VendorDialogComponent, {
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
        this.openSnackBar("Vendor saved", "")
          .onAction()
          .subscribe(() => {
            //            this.router.navigate(['/vendors', result.BusinessEntityId]);
          });
      }
    });
  }

  newVendor(): void {
    this.store.dispatch(new vendorActions.InitializeCurrentVendor());

    this.openVendorDialog();
  }

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000
    });
  }

  vendorSelected(vendor: Vendor): void {
    this.store.dispatch(new vendorActions.SetCurrentVendor(vendor));
  }

  updateVendor(vendor: Vendor): void {
    this.vendorSelected(vendor);

    this.openVendorDialog();
  }

  deleteVendor(vendor: Vendor): void {
    this.vendorSelected(vendor);
    if (this.currentVendor && this.currentVendor.BusinessEntityId) {
      if (
        confirm(`Really delete the vendor: ${this.currentVendor.VendorName}?`)
      ) {
        this.store.dispatch(
          new vendorActions.DeleteVendor(this.currentVendor.BusinessEntityId)
        );
      }
    }
  }
}
