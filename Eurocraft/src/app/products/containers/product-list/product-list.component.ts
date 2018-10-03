import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productActions from '../../store/actions/product.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Product } from '../../models/product';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ProductsDataSource } from "../../services/product.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'ProductName', showInSmallScreen: true },
  { columnName: 'ProductNumber', showInSmallScreen: true },
  { columnName: 'ProductCategoryName', showInSmallScreen: false },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentProduct: Product | null;
  dataSource: ProductsDataSource;
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
    // .subscribe((coreState: ProductsState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getProductError));
    this.loading$ = this.store.pipe(select(selectors.getProductLoading));

    //this.currentProduct$ = this.store.select(fromProduct.getCurrentProduct);

    this.dataSource = new ProductsDataSource(this.store);

    this.store.dispatch(new productActions.LoadProduct());

    this.store.pipe(
      select(selectors.getCurrentProduct),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProduct => this.currentProduct = currentProduct
    );

    this.store.pipe(
      select(selectors.getProductCount),
      takeWhile(() => this.componentActive)
    ).subscribe((productsCount: number) => {
      this.paginator.length = productsCount;
    }
    );

    this.store.pipe(
      select(selectors.getProductDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((productDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = productDataSourceParameters.pageIndex;
      this.paginator.pageSize = productDataSourceParameters.pageSize;
      this.filters = productDataSourceParameters.filters;
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
          this.loadProducts();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadProducts())
      )
      .subscribe();
  }

  loadProducts(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new productActions.SetProductDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openProductDialog(): void {
    let dialogRef = this.dialog.open(ProductDialogComponent, {
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
        this.openSnackBar("Product saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/products', result.ProductId]);
          });
      }
    });
  }

  newProduct(): void {
    this.store.dispatch(new productActions.InitializeCurrentProduct());

    this.openProductDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  productSelected(product: Product): void {
    this.store.dispatch(new productActions.SetCurrentProduct(product));
  }

  updateProduct(product: Product): void {
    this.productSelected(product);

    this.openProductDialog();
  }

  deleteProduct(product: Product): void {
    this.productSelected(product);
    if (this.currentProduct && this.currentProduct.ProductId) {
      if (confirm(`Really delete the product: ${this.currentProduct.ProductName}?`)) {
        this.store.dispatch(new productActions.DeleteProduct(this.currentProduct.ProductId));
      }
    }
  }

}
