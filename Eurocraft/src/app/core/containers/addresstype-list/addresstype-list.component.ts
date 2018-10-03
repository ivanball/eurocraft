import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as addressTypeActions from '../../store/actions/addresstype.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { AddressType } from '../../models/addresstype';
import { AddressTypeDialogComponent } from '../addresstype-dialog/addresstype-dialog.component';
import { AddressTypesDataSource } from "../../services/addresstype.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'AddressTypeName', showInSmallScreen: true },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-addresstype-list',
  templateUrl: './addresstype-list.component.html',
  styleUrls: ['./addresstype-list.component.scss']
})
export class AddressTypeListComponent implements OnInit, OnDestroy {
  pageTitle = 'Address Types';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentAddressType: AddressType | null;
  dataSource: AddressTypesDataSource;
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
    // .subscribe((coreState: AddressTypesState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getAddressTypeError));
    this.loading$ = this.store.pipe(select(selectors.getAddressTypeLoading));

    //this.currentAddressType$ = this.store.select(fromAddressType.getCurrentAddressType);

    this.dataSource = new AddressTypesDataSource(this.store);

    this.store.dispatch(new addressTypeActions.LoadAddressType());

    this.store.pipe(
      select(selectors.getCurrentAddressType),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentAddressType => this.currentAddressType = currentAddressType
    );

    this.store.pipe(
      select(selectors.getAddressTypeCount),
      takeWhile(() => this.componentActive)
    ).subscribe((addressTypesCount: number) => {
      this.paginator.length = addressTypesCount;
    }
    );

    this.store.pipe(
      select(selectors.getAddressTypeDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((addressTypeDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = addressTypeDataSourceParameters.pageIndex;
      this.paginator.pageSize = addressTypeDataSourceParameters.pageSize;
      this.filters = addressTypeDataSourceParameters.filters;
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
          this.loadAddressTypes();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadAddressTypes())
      )
      .subscribe();
  }

  loadAddressTypes(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new addressTypeActions.SetAddressTypeDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openAddressTypeDialog(): void {
    let dialogRef = this.dialog.open(AddressTypeDialogComponent, {
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
        this.openSnackBar("AddressType saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/addressTypes', result.AddressTypeId]);
          });
      }
    });
  }

  newAddressType(): void {
    this.store.dispatch(new addressTypeActions.InitializeCurrentAddressType());

    this.openAddressTypeDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  addressTypeSelected(addressType: AddressType): void {
    this.store.dispatch(new addressTypeActions.SetCurrentAddressType(addressType));
  }

  updateAddressType(addressType: AddressType): void {
    this.addressTypeSelected(addressType);

    this.openAddressTypeDialog();
  }

  deleteAddressType(addressType: AddressType): void {
    this.addressTypeSelected(addressType);
    if (this.currentAddressType && this.currentAddressType.AddressTypeId) {
      if (confirm(`Really delete the address type: ${this.currentAddressType.AddressTypeName}?`)) {
        this.store.dispatch(new addressTypeActions.DeleteAddressType(this.currentAddressType.AddressTypeId));
      }
    }
  }

}
