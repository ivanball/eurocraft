import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as phoneNumberTypeActions from '../../store/actions/phonenumbertype.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { PhoneNumberType } from '../../models/phonenumbertype';
import { PhoneNumberTypeDialogComponent } from '../phonenumbertype-dialog/phonenumbertype-dialog.component';
import { PhoneNumberTypesDataSource } from "../../services/phonenumbertype.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'PhoneNumberTypeName', showInSmallScreen: true },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-phonenumbertype-list',
  templateUrl: './phonenumbertype-list.component.html',
  styleUrls: ['./phonenumbertype-list.component.scss']
})
export class PhoneNumberTypeListComponent implements OnInit, OnDestroy {
  pageTitle = 'PhoneNumber Types';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentPhoneNumberType: PhoneNumberType | null;
  dataSource: PhoneNumberTypesDataSource;
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
    // .subscribe((coreState: PhoneNumberTypesState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getPhoneNumberTypeError));
    this.loading$ = this.store.pipe(select(selectors.getPhoneNumberTypeLoading));

    //this.currentPhoneNumberType$ = this.store.select(fromPhoneNumberType.getCurrentPhoneNumberType);

    this.dataSource = new PhoneNumberTypesDataSource(this.store);

    this.store.dispatch(new phoneNumberTypeActions.LoadPhoneNumberType());

    this.store.pipe(
      select(selectors.getCurrentPhoneNumberType),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentPhoneNumberType => this.currentPhoneNumberType = currentPhoneNumberType
    );

    this.store.pipe(
      select(selectors.getPhoneNumberTypeCount),
      takeWhile(() => this.componentActive)
    ).subscribe((phoneNumberTypesCount: number) => {
      this.paginator.length = phoneNumberTypesCount;
    }
    );

    this.store.pipe(
      select(selectors.getPhoneNumberTypeDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((phoneNumberTypeDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = phoneNumberTypeDataSourceParameters.pageIndex;
      this.paginator.pageSize = phoneNumberTypeDataSourceParameters.pageSize;
      this.filters = phoneNumberTypeDataSourceParameters.filters;
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
          this.loadPhoneNumberTypes();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadPhoneNumberTypes())
      )
      .subscribe();
  }

  loadPhoneNumberTypes(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new phoneNumberTypeActions.SetPhoneNumberTypeDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openPhoneNumberTypeDialog(): void {
    let dialogRef = this.dialog.open(PhoneNumberTypeDialogComponent, {
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
        this.openSnackBar("PhoneNumberType saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/phoneNumberTypes', result.PhoneNumberTypeId]);
          });
      }
    });
  }

  newPhoneNumberType(): void {
    this.store.dispatch(new phoneNumberTypeActions.InitializeCurrentPhoneNumberType());

    this.openPhoneNumberTypeDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  phoneNumberTypeSelected(phoneNumberType: PhoneNumberType): void {
    this.store.dispatch(new phoneNumberTypeActions.SetCurrentPhoneNumberType(phoneNumberType));
  }

  updatePhoneNumberType(phoneNumberType: PhoneNumberType): void {
    this.phoneNumberTypeSelected(phoneNumberType);

    this.openPhoneNumberTypeDialog();
  }

  deletePhoneNumberType(phoneNumberType: PhoneNumberType): void {
    this.phoneNumberTypeSelected(phoneNumberType);
    if (this.currentPhoneNumberType && this.currentPhoneNumberType.PhoneNumberTypeId) {
      if (confirm(`Really delete the phoneNumber type: ${this.currentPhoneNumberType.PhoneNumberTypeName}?`)) {
        this.store.dispatch(new phoneNumberTypeActions.DeletePhoneNumberType(this.currentPhoneNumberType.PhoneNumberTypeId));
      }
    }
  }

}
