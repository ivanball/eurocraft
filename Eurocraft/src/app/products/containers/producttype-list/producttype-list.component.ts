import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productTypeActions from '../../store/actions/producttype.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ProductType } from '../../models/producttype';
import { ProductTypeDialogComponent } from '../producttype-dialog/producttype-dialog.component';
import { ProductTypesDataSource } from "../../services/producttype.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'ProductTypeName', showInSmallScreen: true },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-producttype-list',
  templateUrl: './producttype-list.component.html',
  styleUrls: ['./producttype-list.component.scss']
})
export class ProductTypeListComponent implements OnInit, OnDestroy {
  pageTitle = 'Product Types';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentProductType: ProductType | null;
  dataSource: ProductTypesDataSource;
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
    // .subscribe((coreState: ProductTypesState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getProductTypeError));
    this.loading$ = this.store.pipe(select(selectors.getProductTypeLoading));

    //this.currentProductType$ = this.store.select(fromProductType.getCurrentProductType);

    this.dataSource = new ProductTypesDataSource(this.store);

    this.store.dispatch(new productTypeActions.LoadProductType());

    this.store.pipe(
      select(selectors.getCurrentProductType),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProductType => this.currentProductType = currentProductType
    );

    this.store.pipe(
      select(selectors.getProductTypeCount),
      takeWhile(() => this.componentActive)
    ).subscribe((productTypesCount: number) => {
      this.paginator.length = productTypesCount;
    }
    );

    this.store.pipe(
      select(selectors.getProductTypeDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((productTypeDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = productTypeDataSourceParameters.pageIndex;
      this.paginator.pageSize = productTypeDataSourceParameters.pageSize;
      this.filters = productTypeDataSourceParameters.filters;
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
          this.loadProductTypes();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadProductTypes())
      )
      .subscribe();
  }

  loadProductTypes(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new productTypeActions.SetProductTypeDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openProductTypeDialog(): void {
    let dialogRef = this.dialog.open(ProductTypeDialogComponent, {
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
        this.openSnackBar("ProductType saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/productTypes', result.ProductTypeId]);
          });
      }
    });
  }

  newProductType(): void {
    this.store.dispatch(new productTypeActions.InitializeCurrentProductType());

    this.openProductTypeDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  productTypeSelected(productType: ProductType): void {
    this.store.dispatch(new productTypeActions.SetCurrentProductType(productType));
  }

  updateProductType(productType: ProductType): void {
    this.productTypeSelected(productType);

    this.openProductTypeDialog();
  }

  deleteProductType(productType: ProductType): void {
    this.productTypeSelected(productType);
    if (this.currentProductType && this.currentProductType.ProductTypeId) {
      if (confirm(`Really delete the product type: ${this.currentProductType.ProductTypeName}?`)) {
        this.store.dispatch(new productTypeActions.DeleteProductType(this.currentProductType.ProductTypeId));
      }
    }
  }

}
