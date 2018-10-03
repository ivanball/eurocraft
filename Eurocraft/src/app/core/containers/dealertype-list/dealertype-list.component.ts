import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as dealerTypeActions from '../../store/actions/dealertype.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { DealerType } from '../../models/dealertype';
import { DealerTypeDialogComponent } from '../dealertype-dialog/dealertype-dialog.component';
import { DealerTypesDataSource } from "../../services/dealertype.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'DealerTypeName', showInSmallScreen: true },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-dealertype-list',
  templateUrl: './dealertype-list.component.html',
  styleUrls: ['./dealertype-list.component.scss']
})
export class DealerTypeListComponent implements OnInit, OnDestroy {
  pageTitle = 'Dealer Types';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentDealerType: DealerType | null;
  dataSource: DealerTypesDataSource;
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
    // .subscribe((coreState: DealerTypesState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getDealerTypeError));
    this.loading$ = this.store.pipe(select(selectors.getDealerTypeLoading));

    //this.currentDealerType$ = this.store.select(fromDealerType.getCurrentDealerType);

    this.dataSource = new DealerTypesDataSource(this.store);

    this.store.dispatch(new dealerTypeActions.LoadDealerType());

    this.store.pipe(
      select(selectors.getCurrentDealerType),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentDealerType => this.currentDealerType = currentDealerType
    );

    this.store.pipe(
      select(selectors.getDealerTypeCount),
      takeWhile(() => this.componentActive)
    ).subscribe((dealerTypesCount: number) => {
      this.paginator.length = dealerTypesCount;
    }
    );

    this.store.pipe(
      select(selectors.getDealerTypeDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((dealerTypeDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = dealerTypeDataSourceParameters.pageIndex;
      this.paginator.pageSize = dealerTypeDataSourceParameters.pageSize;
      this.filters = dealerTypeDataSourceParameters.filters;
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
          this.loadDealerTypes();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadDealerTypes())
      )
      .subscribe();
  }

  loadDealerTypes(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new dealerTypeActions.SetDealerTypeDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openDealerTypeDialog(): void {
    let dialogRef = this.dialog.open(DealerTypeDialogComponent, {
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
        this.openSnackBar("DealerType saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/dealerTypes', result.DealerTypeId]);
          });
      }
    });
  }

  newDealerType(): void {
    this.store.dispatch(new dealerTypeActions.InitializeCurrentDealerType());

    this.openDealerTypeDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  dealerTypeSelected(dealerType: DealerType): void {
    this.store.dispatch(new dealerTypeActions.SetCurrentDealerType(dealerType));
  }

  updateDealerType(dealerType: DealerType): void {
    this.dealerTypeSelected(dealerType);

    this.openDealerTypeDialog();
  }

  deleteDealerType(dealerType: DealerType): void {
    this.dealerTypeSelected(dealerType);
    if (this.currentDealerType && this.currentDealerType.DealerTypeId) {
      if (confirm(`Really delete the dealer type: ${this.currentDealerType.DealerTypeName}?`)) {
        this.store.dispatch(new dealerTypeActions.DeleteDealerType(this.currentDealerType.DealerTypeId));
      }
    }
  }

}
