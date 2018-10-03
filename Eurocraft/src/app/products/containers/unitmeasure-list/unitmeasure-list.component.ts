import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as unitMeasureActions from '../../store/actions/unitmeasure.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { UnitMeasure } from '../../models/unitmeasure';
import { UnitMeasureDialogComponent } from '../unitmeasure-dialog/unitmeasure-dialog.component';
import { UnitMeasuresDataSource } from "../../services/unitmeasure.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'UnitMeasureCode', showInSmallScreen: true },
  { columnName: 'UnitMeasureName', showInSmallScreen: true },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-unitmeasure-list',
  templateUrl: './unitmeasure-list.component.html',
  styleUrls: ['./unitmeasure-list.component.scss']
})
export class UnitMeasureListComponent implements OnInit, OnDestroy {
  pageTitle = 'Product Types';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentUnitMeasure: UnitMeasure | null;
  dataSource: UnitMeasuresDataSource;
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
    // .subscribe((coreState: UnitMeasuresState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getUnitMeasureError));
    this.loading$ = this.store.pipe(select(selectors.getUnitMeasureLoading));

    //this.currentUnitMeasure$ = this.store.select(fromUnitMeasure.getCurrentUnitMeasure);

    this.dataSource = new UnitMeasuresDataSource(this.store);

    this.store.dispatch(new unitMeasureActions.LoadUnitMeasure());

    this.store.pipe(
      select(selectors.getCurrentUnitMeasure),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentUnitMeasure => this.currentUnitMeasure = currentUnitMeasure
    );

    this.store.pipe(
      select(selectors.getUnitMeasureCount),
      takeWhile(() => this.componentActive)
    ).subscribe((unitMeasuresCount: number) => {
      this.paginator.length = unitMeasuresCount;
    }
    );

    this.store.pipe(
      select(selectors.getUnitMeasureDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((unitMeasureDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = unitMeasureDataSourceParameters.pageIndex;
      this.paginator.pageSize = unitMeasureDataSourceParameters.pageSize;
      this.filters = unitMeasureDataSourceParameters.filters;
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
          this.loadUnitMeasures();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadUnitMeasures())
      )
      .subscribe();
  }

  loadUnitMeasures(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new unitMeasureActions.SetUnitMeasureDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openUnitMeasureDialog(): void {
    let dialogRef = this.dialog.open(UnitMeasureDialogComponent, {
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
        this.openSnackBar("UnitMeasure saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/unitMeasures', result.UnitMeasureId]);
          });
      }
    });
  }

  newUnitMeasure(): void {
    this.store.dispatch(new unitMeasureActions.InitializeCurrentUnitMeasure());

    this.openUnitMeasureDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  unitMeasureSelected(unitMeasure: UnitMeasure): void {
    this.store.dispatch(new unitMeasureActions.SetCurrentUnitMeasure(unitMeasure));
  }

  updateUnitMeasure(unitMeasure: UnitMeasure): void {
    this.unitMeasureSelected(unitMeasure);

    this.openUnitMeasureDialog();
  }

  deleteUnitMeasure(unitMeasure: UnitMeasure): void {
    this.unitMeasureSelected(unitMeasure);
    if (this.currentUnitMeasure && this.currentUnitMeasure.UnitMeasureId) {
      if (confirm(`Really delete the product type: ${this.currentUnitMeasure.UnitMeasureName}?`)) {
        this.store.dispatch(new unitMeasureActions.DeleteUnitMeasure(this.currentUnitMeasure.UnitMeasureId));
      }
    }
  }

}
