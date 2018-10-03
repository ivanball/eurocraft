import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productSubcategoryActions from '../../store/actions/productsubcategory.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ProductSubcategory } from '../../models/productsubcategory';
import { ProductSubcategoryDialogComponent } from '../productsubcategory-dialog/productsubcategory-dialog.component';
import { ProductSubcategoriesDataSource } from "../../services/productsubcategory.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'ProductSubcategoryName', showInSmallScreen: true },
  { columnName: 'ProductCategoryName', showInSmallScreen: true },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-productsubcategory-list',
  templateUrl: './productsubcategory-list.component.html',
  styleUrls: ['./productsubcategory-list.component.scss']
})
export class ProductSubcategoryListComponent implements OnInit, OnDestroy {
  pageTitle = 'Product Subcategories';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentProductSubcategory: ProductSubcategory | null;
  dataSource: ProductSubcategoriesDataSource;
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
    // .subscribe((coreState: ProductSubcategoriesState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getProductSubcategoryError));
    this.loading$ = this.store.pipe(select(selectors.getProductSubcategoryLoading));

    //this.currentProductSubcategory$ = this.store.select(fromProductSubcategory.getCurrentProductSubcategory);

    this.dataSource = new ProductSubcategoriesDataSource(this.store);

    this.store.dispatch(new productSubcategoryActions.LoadProductSubcategory());

    this.store.pipe(
      select(selectors.getCurrentProductSubcategory),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProductSubcategory => this.currentProductSubcategory = currentProductSubcategory
    );

    this.store.pipe(
      select(selectors.getProductSubcategoryCount),
      takeWhile(() => this.componentActive)
    ).subscribe((productSubcategoriesCount: number) => {
      this.paginator.length = productSubcategoriesCount;
    }
    );

    this.store.pipe(
      select(selectors.getProductSubcategoryDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((productSubcategoryDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = productSubcategoryDataSourceParameters.pageIndex;
      this.paginator.pageSize = productSubcategoryDataSourceParameters.pageSize;
      this.filters = productSubcategoryDataSourceParameters.filters;
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
          this.loadProductSubcategories();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadProductSubcategories())
      )
      .subscribe();
  }

  loadProductSubcategories(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new productSubcategoryActions.SetProductSubcategoryDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openProductSubcategoryDialog(): void {
    let dialogRef = this.dialog.open(ProductSubcategoryDialogComponent, {
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
        this.openSnackBar("ProductSubcategory saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/productSubcategories', result.ProductSubcategoryId]);
          });
      }
    });
  }

  newProductSubcategory(): void {
    this.store.dispatch(new productSubcategoryActions.InitializeCurrentProductSubcategory());

    this.openProductSubcategoryDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  productSubcategorySelected(productSubcategory: ProductSubcategory): void {
    this.store.dispatch(new productSubcategoryActions.SetCurrentProductSubcategory(productSubcategory));
  }

  updateProductSubcategory(productSubcategory: ProductSubcategory): void {
    this.productSubcategorySelected(productSubcategory);

    this.openProductSubcategoryDialog();
  }

  deleteProductSubcategory(productSubcategory: ProductSubcategory): void {
    this.productSubcategorySelected(productSubcategory);
    if (this.currentProductSubcategory && this.currentProductSubcategory.ProductSubcategoryId) {
      if (confirm(`Really delete the product subcategory: ${this.currentProductSubcategory.ProductSubcategoryName}?`)) {
        this.store.dispatch(new productSubcategoryActions.DeleteProductSubcategory(this.currentProductSubcategory.ProductSubcategoryId));
      }
    }
  }

}
