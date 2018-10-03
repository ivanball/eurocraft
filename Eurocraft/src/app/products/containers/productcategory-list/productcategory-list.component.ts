import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productCategoryActions from '../../store/actions/productcategory.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ProductCategory } from '../../models/productcategory';
import { ProductCategoryDialogComponent } from '../productcategory-dialog/productcategory-dialog.component';
import { ProductCategoriesDataSource } from "../../services/productcategory.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'ProductCategoryName', showInSmallScreen: true },
  { columnName: 'ProductTypeName', showInSmallScreen: true },
  { columnName: 'ProductMaterialName', showInSmallScreen: true },
  { columnName: 'ProductModelName', showInSmallScreen: false },
  { columnName: 'ProductUseName', showInSmallScreen: false },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-productcategory-list',
  templateUrl: './productcategory-list.component.html',
  styleUrls: ['./productcategory-list.component.scss']
})
export class ProductCategoryListComponent implements OnInit, OnDestroy {
  pageTitle = 'Product Categories';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentProductCategory: ProductCategory | null;
  dataSource: ProductCategoriesDataSource;
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
    // .subscribe((coreState: ProductCategoriesState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getProductCategoryError));
    this.loading$ = this.store.pipe(select(selectors.getProductCategoryLoading));

    //this.currentProductCategory$ = this.store.select(fromProductCategory.getCurrentProductCategory);

    this.dataSource = new ProductCategoriesDataSource(this.store);

    this.store.dispatch(new productCategoryActions.LoadProductCategory());

    this.store.pipe(
      select(selectors.getCurrentProductCategory),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProductCategory => this.currentProductCategory = currentProductCategory
    );

    this.store.pipe(
      select(selectors.getProductCategoryCount),
      takeWhile(() => this.componentActive)
    ).subscribe((productCategoriesCount: number) => {
      this.paginator.length = productCategoriesCount;
    }
    );

    this.store.pipe(
      select(selectors.getProductCategoryDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((productCategoryDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = productCategoryDataSourceParameters.pageIndex;
      this.paginator.pageSize = productCategoryDataSourceParameters.pageSize;
      this.filters = productCategoryDataSourceParameters.filters;
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
          this.loadProductCategories();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadProductCategories())
      )
      .subscribe();
  }

  loadProductCategories(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new productCategoryActions.SetProductCategoryDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openProductCategoryDialog(): void {
    let dialogRef = this.dialog.open(ProductCategoryDialogComponent, {
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
        this.openSnackBar("ProductCategory saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/productCategories', result.ProductCategoryId]);
          });
      }
    });
  }

  newProductCategory(): void {
    this.store.dispatch(new productCategoryActions.InitializeCurrentProductCategory());

    this.openProductCategoryDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  productCategorySelected(productCategory: ProductCategory): void {
    this.store.dispatch(new productCategoryActions.SetCurrentProductCategory(productCategory));
  }

  updateProductCategory(productCategory: ProductCategory): void {
    this.productCategorySelected(productCategory);

    this.openProductCategoryDialog();
  }

  deleteProductCategory(productCategory: ProductCategory): void {
    this.productCategorySelected(productCategory);
    if (this.currentProductCategory && this.currentProductCategory.ProductCategoryId) {
      if (confirm(`Really delete the product category: ${this.currentProductCategory.ProductCategoryName}?`)) {
        this.store.dispatch(new productCategoryActions.DeleteProductCategory(this.currentProductCategory.ProductCategoryId));
      }
    }
  }

}
