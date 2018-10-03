import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productUseActions from '../../store/actions/productuse.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ProductUse } from '../../models/productuse';
import { ProductUseDialogComponent } from '../productuse-dialog/productuse-dialog.component';
import { ProductUsesDataSource } from "../../services/productuse.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'ProductUseName', showInSmallScreen: true },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-productuse-list',
  templateUrl: './productuse-list.component.html',
  styleUrls: ['./productuse-list.component.scss']
})
export class ProductUseListComponent implements OnInit, OnDestroy {
  pageTitle = 'Product Uses';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentProductUse: ProductUse | null;
  dataSource: ProductUsesDataSource;
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
    // .subscribe((coreState: ProductUsesState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getProductUseError));
    this.loading$ = this.store.pipe(select(selectors.getProductUseLoading));

    //this.currentProductUse$ = this.store.select(fromProductUse.getCurrentProductUse);

    this.dataSource = new ProductUsesDataSource(this.store);

    this.store.dispatch(new productUseActions.LoadProductUse());

    this.store.pipe(
      select(selectors.getCurrentProductUse),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProductUse => this.currentProductUse = currentProductUse
    );

    this.store.pipe(
      select(selectors.getProductUseCount),
      takeWhile(() => this.componentActive)
    ).subscribe((productUsesCount: number) => {
      this.paginator.length = productUsesCount;
    }
    );

    this.store.pipe(
      select(selectors.getProductUseDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((productUseDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = productUseDataSourceParameters.pageIndex;
      this.paginator.pageSize = productUseDataSourceParameters.pageSize;
      this.filters = productUseDataSourceParameters.filters;
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
          this.loadProductUses();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadProductUses())
      )
      .subscribe();
  }

  loadProductUses(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new productUseActions.SetProductUseDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openProductUseDialog(): void {
    let dialogRef = this.dialog.open(ProductUseDialogComponent, {
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
        this.openSnackBar("ProductUse saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/productUses', result.ProductUseId]);
          });
      }
    });
  }

  newProductUse(): void {
    this.store.dispatch(new productUseActions.InitializeCurrentProductUse());

    this.openProductUseDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  productUseSelected(productUse: ProductUse): void {
    this.store.dispatch(new productUseActions.SetCurrentProductUse(productUse));
  }

  updateProductUse(productUse: ProductUse): void {
    this.productUseSelected(productUse);

    this.openProductUseDialog();
  }

  deleteProductUse(productUse: ProductUse): void {
    this.productUseSelected(productUse);
    if (this.currentProductUse && this.currentProductUse.ProductUseId) {
      if (confirm(`Really delete the product use: ${this.currentProductUse.ProductUseName}?`)) {
        this.store.dispatch(new productUseActions.DeleteProductUse(this.currentProductUse.ProductUseId));
      }
    }
  }

}
