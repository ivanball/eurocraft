import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as paymentTypeActions from '../../store/actions/paymenttype.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { PaymentType } from '../../models/paymenttype';
import { PaymentTypeDialogComponent } from '../paymenttype-dialog/paymenttype-dialog.component';
import { PaymentTypesDataSource } from "../../services/paymenttype.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'PaymentTypeName', showInSmallScreen: true },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-paymenttype-list',
  templateUrl: './paymenttype-list.component.html',
  styleUrls: ['./paymenttype-list.component.scss']
})
export class PaymentTypeListComponent implements OnInit, OnDestroy {
  pageTitle = 'Payment Types';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentPaymentType: PaymentType | null;
  dataSource: PaymentTypesDataSource;
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
    // .subscribe((coreState: PaymentTypesState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getPaymentTypeError));
    this.loading$ = this.store.pipe(select(selectors.getPaymentTypeLoading));

    //this.currentPaymentType$ = this.store.select(fromPaymentType.getCurrentPaymentType);

    this.dataSource = new PaymentTypesDataSource(this.store);

    this.store.dispatch(new paymentTypeActions.LoadPaymentType());

    this.store.pipe(
      select(selectors.getCurrentPaymentType),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentPaymentType => this.currentPaymentType = currentPaymentType
    );

    this.store.pipe(
      select(selectors.getPaymentTypeCount),
      takeWhile(() => this.componentActive)
    ).subscribe((paymentTypesCount: number) => {
      this.paginator.length = paymentTypesCount;
    }
    );

    this.store.pipe(
      select(selectors.getPaymentTypeDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((paymentTypeDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = paymentTypeDataSourceParameters.pageIndex;
      this.paginator.pageSize = paymentTypeDataSourceParameters.pageSize;
      this.filters = paymentTypeDataSourceParameters.filters;
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
          this.loadPaymentTypes();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadPaymentTypes())
      )
      .subscribe();
  }

  loadPaymentTypes(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new paymentTypeActions.SetPaymentTypeDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openPaymentTypeDialog(): void {
    let dialogRef = this.dialog.open(PaymentTypeDialogComponent, {
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
        this.openSnackBar("PaymentType saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/paymentTypes', result.PaymentTypeId]);
          });
      }
    });
  }

  newPaymentType(): void {
    this.store.dispatch(new paymentTypeActions.InitializeCurrentPaymentType());

    this.openPaymentTypeDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  paymentTypeSelected(paymentType: PaymentType): void {
    this.store.dispatch(new paymentTypeActions.SetCurrentPaymentType(paymentType));
  }

  updatePaymentType(paymentType: PaymentType): void {
    this.paymentTypeSelected(paymentType);

    this.openPaymentTypeDialog();
  }

  deletePaymentType(paymentType: PaymentType): void {
    this.paymentTypeSelected(paymentType);
    if (this.currentPaymentType && this.currentPaymentType.PaymentTypeId) {
      if (confirm(`Really delete the payment type: ${this.currentPaymentType.PaymentTypeName}?`)) {
        this.store.dispatch(new paymentTypeActions.DeletePaymentType(this.currentPaymentType.PaymentTypeId));
      }
    }
  }

}
