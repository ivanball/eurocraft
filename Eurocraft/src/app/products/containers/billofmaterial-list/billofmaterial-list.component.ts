import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as billOfMaterialActions from '../../store/actions/billofmaterial.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BillOfMaterial } from '../../models/billofmaterial';
import { BillOfMaterialDialogComponent } from '../billofmaterial-dialog/billofmaterial-dialog.component';
import { BillOfMaterialsDataSource } from "../../services/billofmaterial.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'ProductAssemblyName', showInSmallScreen: true },
  { columnName: 'ComponentName', showInSmallScreen: true },
  { columnName: 'HorizontalQuantity', showInSmallScreen: true },
  { columnName: 'HorizontalFormula', showInSmallScreen: false },
  { columnName: 'VerticalQuantity', showInSmallScreen: true },
  { columnName: 'VerticalFormula', showInSmallScreen: false },
  { columnName: 'UnitMeasureName', showInSmallScreen: false },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-billofmaterial-list',
  templateUrl: './billofmaterial-list.component.html',
  styleUrls: ['./billofmaterial-list.component.scss']
})
export class BillOfMaterialListComponent implements OnInit, OnDestroy {
  pageTitle = 'BillOfMaterials';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentBillOfMaterial: BillOfMaterial | null;
  dataSource: BillOfMaterialsDataSource;
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
    // .subscribe((coreState: BillOfMaterialsState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getBillOfMaterialError));
    this.loading$ = this.store.pipe(select(selectors.getBillOfMaterialLoading));

    //this.currentBillOfMaterial$ = this.store.select(fromBillOfMaterial.getCurrentBillOfMaterial);

    this.dataSource = new BillOfMaterialsDataSource(this.store);

    this.store.dispatch(new billOfMaterialActions.LoadBillOfMaterial());

    this.store.pipe(
      select(selectors.getCurrentBillOfMaterial),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentBillOfMaterial => this.currentBillOfMaterial = currentBillOfMaterial
    );

    this.store.pipe(
      select(selectors.getBillOfMaterialCount),
      takeWhile(() => this.componentActive)
    ).subscribe((billOfMaterialsCount: number) => {
      this.paginator.length = billOfMaterialsCount;
    }
    );

    this.store.pipe(
      select(selectors.getBillOfMaterialDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((billOfMaterialDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = billOfMaterialDataSourceParameters.pageIndex;
      this.paginator.pageSize = billOfMaterialDataSourceParameters.pageSize;
      this.filters = billOfMaterialDataSourceParameters.filters;
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
          this.loadBillOfMaterials();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadBillOfMaterials())
      )
      .subscribe();
  }

  loadBillOfMaterials(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new billOfMaterialActions.SetBillOfMaterialDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openBillOfMaterialDialog(): void {
    let dialogRef = this.dialog.open(BillOfMaterialDialogComponent, {
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
        this.openSnackBar("BillOfMaterial saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/billOfMaterials', result.BillOfMaterialsId]);
          });
      }
    });
  }

  newBillOfMaterial(): void {
    this.store.dispatch(new billOfMaterialActions.InitializeCurrentBillOfMaterial());

    this.openBillOfMaterialDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  billOfMaterialSelected(billOfMaterial: BillOfMaterial): void {
    this.store.dispatch(new billOfMaterialActions.SetCurrentBillOfMaterial(billOfMaterial));
  }

  updateBillOfMaterial(billOfMaterial: BillOfMaterial): void {
    this.billOfMaterialSelected(billOfMaterial);

    this.openBillOfMaterialDialog();
  }

  deleteBillOfMaterial(billOfMaterial: BillOfMaterial): void {
    this.billOfMaterialSelected(billOfMaterial);
    if (this.currentBillOfMaterial && this.currentBillOfMaterial.BillOfMaterialsId) {
      if (confirm(`Really delete the billOfMaterial: ${this.currentBillOfMaterial.ProductAssemblyName} - ${this.currentBillOfMaterial.ComponentName}?`)) {
        this.store.dispatch(new billOfMaterialActions.DeleteBillOfMaterial(this.currentBillOfMaterial.BillOfMaterialsId));
      }
    }
  }

}
